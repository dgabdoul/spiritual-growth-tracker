
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heart, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const DonationPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDonation = async () => {
    if (!user) {
      toast({
        title: "Connexion requise",
        description: "Veuillez vous connecter pour faire un don",
        variant: "destructive"
      });
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Montant invalide",
        description: "Veuillez entrer un montant valide",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Créer l'entrée dans la base de données
      const { data: donation, error: dbError } = await supabase
        .from('donations')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          currency: 'EUR',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Rediriger vers Moneroo pour le paiement
      const response = await fetch('https://api.moneroo.io/v1/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer pvk_sandbox_3y2rc0|01JRVFHQR9QHXA64QQS84FB4GF`
        },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100, // Moneroo attend le montant en centimes
          currency: 'EUR',
          redirect_url: window.location.origin + '/donation/success',
          cancel_url: window.location.origin + '/donation',
          metadata: {
            donation_id: donation.id
          }
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la création du lien de paiement');

      const paymentData = await response.json();
      window.location.href = paymentData.url;

    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du traitement de votre don",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Faire un don</CardTitle>
          <CardDescription className="text-center">
            Soutenez notre mission en faisant un don
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium">
              Montant (EUR)
            </label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Entrez le montant"
              className="w-full"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full" 
            onClick={handleDonation} 
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Heart className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Traitement...' : 'Faire un don'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DonationPage;
