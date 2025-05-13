
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface WebhookSettings {
  whatsapp_url: string | null;
  telegram_url: string | null;
  events: string[];
}

export const useWebhook = () => {
  const { user } = useAuth();
  
  const getWebhookSettings = useCallback(async (): Promise<WebhookSettings | null> => {
    if (!user) return null;
    
    try {
      // Use type casting to handle the webhook_settings table that's not in the TypeScript definitions yet
      const { data, error } = await supabase
        .from('webhook_settings')
        .select('*')
        .eq('user_id', user.id)
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
  }, [user]);

  const sendWebhookNotification = useCallback(async (event: string, payload: any) => {
    if (!user) return;
    
    try {
      const settings = await getWebhookSettings();
      
      if (!settings || !settings.events.includes(event)) return;
      
      const messageBody = JSON.stringify({
        event,
        user_id: user.id,
        timestamp: new Date().toISOString(),
        ...payload
      });
      
      // Send to WhatsApp if configured
      if (settings.whatsapp_url) {
        try {
          await fetch(settings.whatsapp_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors',
            body: messageBody
          });
        } catch (error) {
          console.error("Error sending WhatsApp webhook:", error);
        }
      }
      
      // Send to Telegram if configured
      if (settings.telegram_url) {
        try {
          await fetch(settings.telegram_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors',
            body: messageBody
          });
        } catch (error) {
          console.error("Error sending Telegram webhook:", error);
        }
      }
    } catch (error) {
      console.error("Error in webhook notification:", error);
    }
  }, [user, getWebhookSettings]);

  return { 
    sendWebhookNotification,
    getWebhookSettings
  };
};
