
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Heart, User, Flag, DollarSign, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define a schema for form validation
const donationSchema = z.object({
  fullName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères" }),
  country: z.string().min(2, { message: "Veuillez entrer un pays valide" }),
  amount: z.string().refine(val => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, { message: "Veuillez entrer un montant valide" })
});

type DonationFormData = z.infer<typeof donationSchema>;

const DonationPage = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DonationFormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      fullName: '',
      country: '',
      amount: ''
    }
  });

  const handleDonation = async (data: DonationFormData) => {
    setIsLoading(true);
    try {
      // Create donation entry in the database
      const { data: donation, error: dbError } = await supabase
        .from('donations')
        .insert({
          amount: parseFloat(data.amount),
          currency: 'XOF',
          user_id: null, // No login required
          status: 'pending',
          donor_name: data.fullName,
          donor_country: data.country
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw dbError;
      }

      if (!donation) {
        throw new Error('No donation data returned');
      }

      // Redirect to Moneroo for payment
      const response = await fetch('https://api.moneroo.io/v1/payment-links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer pvk_sandbox_3y2rc0|01JRVFHQR9QHXA64QQS84FB4GF`
        },
        body: JSON.stringify({
          amount: parseFloat(data.amount) * 100, // Moneroo expects amount in cents
          currency: 'XOF',
          redirect_url: window.location.origin + '/donation/success',
          cancel_url: window.location.origin + '/donation',
          metadata: {
            donation_id: donation.id,
            donor_name: data.fullName,
            donor_country: data.country
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment API error:', errorText);
        throw new Error(`Erreur lors de la création du lien de paiement: ${response.status} ${response.statusText}`);
      }

      const paymentData = await response.json();
      if (paymentData && paymentData.url) {
        window.location.href = paymentData.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }

    } catch (error) {
      console.error('Error:', error);
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleDonation)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom complet</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input className="pl-9" placeholder="Votre nom" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pays</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Flag className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                          className="pl-9" 
                          placeholder="Votre pays" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Montant (XOF)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                        <Input 
                          type="number" 
                          min="1" 
                          step="1"
                          className="pl-9"
                          placeholder="Montant du don"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                type="submit"
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
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default DonationPage;
