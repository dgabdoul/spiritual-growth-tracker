
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
  
  // Utiliser memoization pour de meilleures performances
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
        console.error("Erreur lors de la récupération des paramètres webhook:", error);
        return null;
      }
      
      if (!data) {
        return null;
      }
      
      // Casting explicite pour satisfaire TypeScript
      return {
        whatsapp_url: data.whatsapp_url ?? null,
        telegram_url: data.telegram_url ?? null,
        events: Array.isArray(data.events) ? data.events : []
      } as WebhookSettings;
    } catch (error) {
      console.error("Exception lors de la récupération des paramètres webhook:", error);
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
      
      // Utiliser Promise.all pour envoyer les notifications en parallèle
      const promises: Promise<any>[] = [];
      
      // Envoyer à WhatsApp si configuré
      if (settings.whatsapp_url) {
        promises.push(
          fetch(settings.whatsapp_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors',
            body: messageBody
          }).catch(error => console.error("Erreur lors de l'envoi du webhook WhatsApp:", error))
        );
      }
      
      // Envoyer à Telegram si configuré
      if (settings.telegram_url) {
        promises.push(
          fetch(settings.telegram_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors',
            body: messageBody
          }).catch(error => console.error("Erreur lors de l'envoi du webhook Telegram:", error))
        );
      }
      
      // Attendre que toutes les promesses soient résolues
      await Promise.all(promises);
    } catch (error) {
      console.error("Erreur dans la notification webhook:", error);
    }
  }, [userId, getWebhookSettings]);

  return { 
    sendWebhookNotification,
    getWebhookSettings
  };
};
