
import { useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface WebhookSettings {
  whatsapp_url: string | null;
  telegram_url: string | null;
  events: string[];
}

export const useWebhook = () => {
  const { user } = useAuth();
  
  // Use memoization for better performance
  const userId = useMemo(() => user?.id, [user?.id]);
  
  const getWebhookSettings = useCallback(async (): Promise<WebhookSettings | null> => {
    if (!userId) return null;
    
    try {
      const { data, error } = await supabase
        .from('webhook_settings')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching webhook settings:", error);
        return null;
      }
      
      // Add explicit type check to make TypeScript happy
      if (data) {
        return {
          whatsapp_url: data.whatsapp_url,
          telegram_url: data.telegram_url,
          events: data.events || []
        } as WebhookSettings;
      }
      
      return null;
    } catch (error) {
      console.error("Exception fetching webhook settings:", error);
      return null;
    }
  }, [userId]);

  const sendWebhookNotification = useCallback(async (event: string, payload: any) => {
    if (!userId) return;
    
    try {
      const settings = await getWebhookSettings();
      
      if (!settings || !settings.events.includes(event)) return;
      
      const messageBody = JSON.stringify({
        event,
        user_id: userId,
        timestamp: new Date().toISOString(),
        ...payload
      });
      
      // Use Promise.all to send notifications in parallel
      const promises: Promise<any>[] = [];
      
      // Send to WhatsApp if configured
      if (settings.whatsapp_url) {
        promises.push(
          fetch(settings.whatsapp_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors',
            body: messageBody
          }).catch(error => console.error("Error sending WhatsApp webhook:", error))
        );
      }
      
      // Send to Telegram if configured
      if (settings.telegram_url) {
        promises.push(
          fetch(settings.telegram_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors',
            body: messageBody
          }).catch(error => console.error("Error sending Telegram webhook:", error))
        );
      }
      
      // Wait for all promises to resolve
      await Promise.all(promises);
    } catch (error) {
      console.error("Error in webhook notification:", error);
    }
  }, [userId, getWebhookSettings]);

  return { 
    sendWebhookNotification,
    getWebhookSettings
  };
};
