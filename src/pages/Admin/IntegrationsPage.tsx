
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import { Check, CreditCard, Play, Loader2, AlertCircle, Link as LinkIcon, CircleHelp, Banknote, Video } from 'lucide-react';

const IntegrationsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [paypalClientId, setPaypalClientId] = useState("");
  const [streamingUrl, setStreamingUrl] = useState("");
  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [isPaypalConnected, setIsPaypalConnected] = useState(false);
  const [isStreamingConnected, setIsStreamingConnected] = useState(false);
  const [isLoading, setIsLoading] = useState({
    stripe: false,
    paypal: false,
    streaming: false
  });

  const handleConnectStripe = () => {
    if (!stripeApiKey) {
      toast.error("Erreur", {
        description: "Veuillez entrer une clé API Stripe valide"
      });
      return;
    }

    setIsLoading({...isLoading, stripe: true});
    
    // Simulate API connection
    setTimeout(() => {
      setIsStripeConnected(true);
      setIsLoading({...isLoading, stripe: false});
      toast.success("Connecté avec succès", {
        description: "L'intégration avec Stripe a été configurée"
      });
    }, 1500);
  };

  const handleConnectPaypal = () => {
    if (!paypalClientId) {
      toast.error("Erreur", {
        description: "Veuillez entrer un Client ID PayPal valide"
      });
      return;
    }

    setIsLoading({...isLoading, paypal: true});
    
    // Simulate API connection
    setTimeout(() => {
      setIsPaypalConnected(true);
      setIsLoading({...isLoading, paypal: false});
      toast.success("Connecté avec succès", {
        description: "L'intégration avec PayPal a été configurée"
      });
    }, 1500);
  };

  const handleConnectStreaming = () => {
    if (!streamingUrl) {
      toast.error("Erreur", {
        description: "Veuillez entrer une URL de streaming valide"
      });
      return;
    }

    setIsLoading({...isLoading, streaming: true});
    
    // Simulate API connection
    setTimeout(() => {
      setIsStreamingConnected(true);
      setIsLoading({...isLoading, streaming: false});
      toast.success("Connecté avec succès", {
        description: "L'intégration avec le service de streaming a été configurée"
      });
    }, 1500);
  };

  const handleToggleIntegration = (integration: string) => {
    switch(integration) {
      case 'stripe':
        if (isStripeConnected) {
          setIsStripeConnected(false);
          toast.info("Intégration désactivée", {
            description: "L'intégration avec Stripe a été désactivée"
          });
        }
        break;
      case 'paypal':
        if (isPaypalConnected) {
          setIsPaypalConnected(false);
          toast.info("Intégration désactivée", {
            description: "L'intégration avec PayPal a été désactivée"
          });
        }
        break;
      case 'streaming':
        if (isStreamingConnected) {
          setIsStreamingConnected(false);
          toast.info("Intégration désactivée", {
            description: "L'intégration avec le service de streaming a été désactivée"
          });
        }
        break;
    }
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
              <h1 className="text-3xl font-bold text-gray-900">Intégrations</h1>
              <p className="text-gray-600 mt-1">Connectez des services externes à votre plateforme</p>
            </div>

            <div className="grid gap-6">
              {/* Payment Integrations */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Banknote className="h-5 w-5 mr-2 text-spirit-purple" />
                  Solutions de paiement
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                            Stripe
                          </CardTitle>
                          <CardDescription>
                            Intégrer des paiements par carte bancaire avec Stripe
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="stripe-active" className="text-xs text-gray-500">Actif</Label>
                          <Switch
                            id="stripe-active"
                            checked={isStripeConnected}
                            onCheckedChange={() => handleToggleIntegration('stripe')}
                            disabled={!isStripeConnected}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isStripeConnected ? (
                        <div className="bg-green-50 text-green-700 p-3 rounded-md flex items-center">
                          <Check className="h-5 w-5 mr-2" />
                          <span>Connecté avec Stripe</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="stripe-api-key">Clé API secrète</Label>
                            <Input
                              id="stripe-api-key"
                              type="password"
                              placeholder="sk_test_..."
                              value={stripeApiKey}
                              onChange={(e) => setStripeApiKey(e.target.value)}
                            />
                            <p className="text-xs text-gray-500">
                              Trouvez votre clé API dans le tableau de bord Stripe.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {isStripeConnected ? (
                        <Button variant="outline" size="sm" onClick={() => setIsStripeConnected(false)}>
                          Reconfigurer
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleConnectStripe} 
                          disabled={isLoading.stripe}
                          className="bg-spirit-purple hover:bg-spirit-deep-purple w-full"
                        >
                          {isLoading.stripe ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connexion en cours...
                            </>
                          ) : (
                            <>Connecter Stripe</>
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>

                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                            PayPal
                          </CardTitle>
                          <CardDescription>
                            Accepter les paiements via PayPal
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label htmlFor="paypal-active" className="text-xs text-gray-500">Actif</Label>
                          <Switch
                            id="paypal-active"
                            checked={isPaypalConnected}
                            onCheckedChange={() => handleToggleIntegration('paypal')}
                            disabled={!isPaypalConnected}
                          />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {isPaypalConnected ? (
                        <div className="bg-blue-50 text-blue-700 p-3 rounded-md flex items-center">
                          <Check className="h-5 w-5 mr-2" />
                          <span>Connecté avec PayPal</span>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="paypal-client-id">Client ID</Label>
                            <Input
                              id="paypal-client-id"
                              type="text"
                              placeholder="ATlm23Xk..."
                              value={paypalClientId}
                              onChange={(e) => setPaypalClientId(e.target.value)}
                            />
                            <p className="text-xs text-gray-500">
                              Trouvez votre Client ID dans les paramètres de votre compte développeur PayPal.
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {isPaypalConnected ? (
                        <Button variant="outline" size="sm" onClick={() => setIsPaypalConnected(false)}>
                          Reconfigurer
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleConnectPaypal} 
                          disabled={isLoading.paypal}
                          className="bg-spirit-purple hover:bg-spirit-deep-purple w-full"
                        >
                          {isLoading.paypal ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Connexion en cours...
                            </>
                          ) : (
                            <>Connecter PayPal</>
                          )}
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                </div>
              </div>

              {/* Media Streaming Integration */}
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Video className="h-5 w-5 mr-2 text-spirit-purple" />
                  Streaming vidéo
                </h2>
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center">
                          <Play className="h-5 w-5 mr-2 text-purple-600" />
                          Service de streaming
                        </CardTitle>
                        <CardDescription>
                          Intégrer un service de streaming vidéo externe
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label htmlFor="streaming-active" className="text-xs text-gray-500">Actif</Label>
                        <Switch
                          id="streaming-active"
                          checked={isStreamingConnected}
                          onCheckedChange={() => handleToggleIntegration('streaming')}
                          disabled={!isStreamingConnected}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isStreamingConnected ? (
                      <div className="bg-purple-50 text-purple-700 p-3 rounded-md flex items-center">
                        <Check className="h-5 w-5 mr-2" />
                        <span>Connecté au service de streaming</span>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="streaming-url">URL de streaming</Label>
                          <Input
                            id="streaming-url"
                            type="text"
                            placeholder="https://streaming.example.com/api"
                            value={streamingUrl}
                            onChange={(e) => setStreamingUrl(e.target.value)}
                          />
                          <p className="text-xs text-gray-500">
                            L'URL de base de l'API de votre service de streaming.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    {isStreamingConnected ? (
                      <Button variant="outline" size="sm" onClick={() => setIsStreamingConnected(false)}>
                        Reconfigurer
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleConnectStreaming} 
                        disabled={isLoading.streaming}
                        className="bg-spirit-purple hover:bg-spirit-deep-purple w-full"
                      >
                        {isLoading.streaming ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connexion en cours...
                          </>
                        ) : (
                          <>Connecter le service de streaming</>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>

              {/* Documentation and help */}
              <div className="bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex items-start">
                  <CircleHelp className="h-5 w-5 mr-2 text-spirit-purple mt-1" />
                  <div>
                    <h3 className="font-medium">Besoin d'aide avec les intégrations ?</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Consultez notre documentation ou contactez notre équipe de support pour vous aider à configurer vos intégrations.
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        <LinkIcon className="h-3 w-3 mr-1" />
                        Documentation
                      </Button>
                      <Button variant="outline" size="sm" className="text-xs">
                        Contacter le support
                      </Button>
                    </div>
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

export default IntegrationsPage;
