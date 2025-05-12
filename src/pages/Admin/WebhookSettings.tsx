
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import { AlertCircle, Send, MessageSquare, Bell } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useWebhook } from '@/hooks/useWebhook';

const WebhookSettings: React.FC = () => {
  const { isAdmin, user } = useAuth();
  const [whatsappWebhook, setWhatsappWebhook] = useState("");
  const [telegramWebhook, setTelegramWebhook] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>(["login", "password_change"]);
  const [isWhatsappEnabled, setIsWhatsappEnabled] = useState(false);
  const [isTelegramEnabled, setIsTelegramEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState({
    whatsapp: false,
    telegram: false
  });
  const { getWebhookSettings } = useWebhook();

  useEffect(() => {
    // Fetch existing webhook settings when component mounts
    if (user) {
      const loadSettings = async () => {
        const settings = await getWebhookSettings();
        if (settings) {
          if (settings.whatsapp_url) {
            setWhatsappWebhook(settings.whatsapp_url);
            setIsWhatsappEnabled(true);
          }
          if (settings.telegram_url) {
            setTelegramWebhook(settings.telegram_url);
            setIsTelegramEnabled(true);
          }
          if (settings.events && settings.events.length > 0) {
            setSelectedEvents(settings.events);
          }
        }
      };
      
      loadSettings();
    }
  }, [user, getWebhookSettings]);

  const saveWebhookSettings = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('webhook_settings' as any)
        .upsert({
          user_id: user.id,
          whatsapp_url: isWhatsappEnabled ? whatsappWebhook : null,
          telegram_url: isTelegramEnabled ? telegramWebhook : null,
          events: selectedEvents
        });

      if (error) throw error;
      
      toast.success("Paramètres de webhook enregistrés", {
        description: "Vos webhooks ont été configurés avec succès."
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement des webhooks:", error);
      toast.error("Erreur", {
        description: "Un problème est survenu lors de l'enregistrement des paramètres de webhook."
      });
    }
  };

  const testWebhook = async (type: 'whatsapp' | 'telegram') => {
    const webhookUrl = type === 'whatsapp' ? whatsappWebhook : telegramWebhook;
    
    if (!webhookUrl) {
      toast.error("URL manquante", {
        description: `Veuillez entrer une URL de webhook ${type === 'whatsapp' ? 'WhatsApp' : 'Telegram'} valide.`
      });
      return;
    }

    setIsLoading({...isLoading, [type]: true});
    
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify({
          event: 'test',
          timestamp: new Date().toISOString(),
          message: `Ceci est un test de notification ${type === 'whatsapp' ? 'WhatsApp' : 'Telegram'} depuis votre application.`
        })
      });
      
      toast.success("Test envoyé", {
        description: "La requête de test a été envoyée. Vérifiez votre service de notification."
      });
    } catch (error) {
      console.error(`Erreur lors du test du webhook ${type}:`, error);
      toast.error("Erreur", {
        description: `Un problème est survenu lors du test du webhook ${type === 'whatsapp' ? 'WhatsApp' : 'Telegram'}.`
      });
    } finally {
      setIsLoading({...isLoading, [type]: false});
    }
  };

  const handleToggleWhatsapp = (enabled: boolean) => {
    setIsWhatsappEnabled(enabled);
    if (!enabled && !isTelegramEnabled) {
      toast.info("Information", {
        description: "Au moins un service de notification doit être activé pour recevoir des alertes."
      });
    }
  };

  const handleToggleTelegram = (enabled: boolean) => {
    setIsTelegramEnabled(enabled);
    if (!enabled && !isWhatsappEnabled) {
      toast.info("Information", {
        description: "Au moins un service de notification doit être activé pour recevoir des alertes."
      });
    }
  };

  const handleEventToggle = (event: string) => {
    setSelectedEvents(current => 
      current.includes(event) 
        ? current.filter(e => e !== event)
        : [...current, event]
    );
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900">Accès refusé</h1>
            <p className="mt-4 text-gray-600">Vous n'avez pas les droits nécessaires pour accéder à cette page.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configuration des webhooks</h1>
              <p className="text-gray-600 mt-1">Intégrez des notifications WhatsApp et Telegram pour les activités du compte</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-spirit-purple" />
                  Événements à notifier
                </CardTitle>
                <CardDescription>
                  Sélectionnez les événements pour lesquels vous souhaitez recevoir des notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="login-event" 
                      checked={selectedEvents.includes('login')}
                      onCheckedChange={() => handleEventToggle('login')}
                    />
                    <Label htmlFor="login-event">Connexion à un compte</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="password-event" 
                      checked={selectedEvents.includes('password_change')}
                      onCheckedChange={() => handleEventToggle('password_change')}
                    />
                    <Label htmlFor="password-event">Modification du mot de passe</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="profile-event" 
                      checked={selectedEvents.includes('profile_update')}
                      onCheckedChange={() => handleEventToggle('profile_update')}
                    />
                    <Label htmlFor="profile-event">Mise à jour du profil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="signup-event" 
                      checked={selectedEvents.includes('signup')}
                      onCheckedChange={() => handleEventToggle('signup')}
                    />
                    <Label htmlFor="signup-event">Nouvelle inscription</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* WhatsApp Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                      WhatsApp
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="whatsapp-active" className="text-sm text-gray-500">Actif</Label>
                      <Switch
                        id="whatsapp-active"
                        checked={isWhatsappEnabled}
                        onCheckedChange={handleToggleWhatsapp}
                      />
                    </div>
                  </div>
                  <CardDescription>
                    Configurer les notifications WhatsApp via webhook
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="whatsapp-webhook">URL du webhook WhatsApp</Label>
                      <Input
                        id="whatsapp-webhook"
                        type="text"
                        placeholder="https://api.example.com/whatsapp-webhook"
                        value={whatsappWebhook}
                        onChange={(e) => setWhatsappWebhook(e.target.value)}
                        disabled={!isWhatsappEnabled}
                      />
                      <p className="text-xs text-gray-500">
                        Entrez l'URL du webhook fournie par votre service d'intégration WhatsApp.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => testWebhook('whatsapp')} 
                    disabled={!isWhatsappEnabled || !whatsappWebhook || isLoading.whatsapp}
                    className="mr-2"
                  >
                    {isLoading.whatsapp ? "Envoi..." : "Tester"}
                  </Button>
                  <Button 
                    onClick={saveWebhookSettings}
                    className="bg-spirit-purple hover:bg-spirit-deep-purple"
                  >
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>

              {/* Telegram Configuration */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center">
                      <Send className="h-5 w-5 mr-2 text-blue-600" />
                      Telegram
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="telegram-active" className="text-sm text-gray-500">Actif</Label>
                      <Switch
                        id="telegram-active"
                        checked={isTelegramEnabled}
                        onCheckedChange={handleToggleTelegram}
                      />
                    </div>
                  </div>
                  <CardDescription>
                    Configurer les notifications Telegram via webhook
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="telegram-webhook">URL du webhook Telegram</Label>
                      <Input
                        id="telegram-webhook"
                        type="text"
                        placeholder="https://api.telegram.org/bot{token}/sendMessage"
                        value={telegramWebhook}
                        onChange={(e) => setTelegramWebhook(e.target.value)}
                        disabled={!isTelegramEnabled}
                      />
                      <p className="text-xs text-gray-500">
                        Entrez l'URL du webhook fournie par votre bot Telegram.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => testWebhook('telegram')} 
                    disabled={!isTelegramEnabled || !telegramWebhook || isLoading.telegram}
                    className="mr-2"
                  >
                    {isLoading.telegram ? "Envoi..." : "Tester"}
                  </Button>
                  <Button 
                    onClick={saveWebhookSettings}
                    className="bg-spirit-purple hover:bg-spirit-deep-purple"
                  >
                    Enregistrer
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 text-amber-500 mt-1" />
                <div>
                  <h3 className="font-medium">Comment configurer vos webhooks</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Pour WhatsApp, vous pouvez utiliser des services comme Twilio ou des applications tierces qui fournissent des API webhook.
                    Pour Telegram, créez un bot via BotFather et utilisez l'URL de webhook fournie.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs">
                      Guide WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs">
                      Guide Telegram
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default WebhookSettings;
