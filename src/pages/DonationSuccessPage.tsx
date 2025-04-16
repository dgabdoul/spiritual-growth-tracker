
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const DonationSuccessPage = () => {
  const { toast } = useToast();
  
  useEffect(() => {
    const updateDonationStatus = async () => {
      // Get the payment ID from the URL if available
      const urlParams = new URLSearchParams(window.location.search);
      const paymentId = urlParams.get('payment_id');
      
      if (paymentId) {
        try {
          // Update the donation status to 'completed' and save the payment ID
          const { error } = await supabase
            .from('donations')
            .update({ 
              status: 'completed',
              moneroo_payment_id: paymentId
            })
            .eq('moneroo_payment_id', paymentId);
            
          if (error) {
            console.error('Error updating donation status:', error);
            toast({
              title: "Attention",
              description: "Votre paiement a été traité, mais nous n'avons pas pu mettre à jour nos dossiers.",
              variant: "default" // Changed from "warning" to "default"
            });
          }
        } catch (err) {
          console.error('Error in donation success page:', err);
        }
      }
    };
    
    updateDonationStatus();
  }, [toast]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto text-center">
        <CardHeader>
          <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-green-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Merci pour votre don !</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            Votre soutien est très apprécié et contribuera à notre mission.
          </p>
          <Button asChild>
            <Link to="/">Retour à l'accueil</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationSuccessPage;
