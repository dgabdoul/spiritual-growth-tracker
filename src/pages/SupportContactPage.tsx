
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Contact, HelpCircle, Mail, MessageSquare, Phone } from 'lucide-react';

// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Le nom doit comporter au moins 2 caractères" }),
  email: z.string().email({ message: "Adresse email invalide" }),
  subject: z.string().min(5, { message: "Le sujet doit comporter au moins 5 caractères" }),
  message: z.string().min(10, { message: "Le message doit comporter au moins 10 caractères" }),
});

type FormValues = z.infer<typeof formSchema>;

const SupportContactPage: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      subject: '',
      message: '',
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulate sending the support request
    setTimeout(() => {
      console.log('Support request submitted:', data);
      
      toast({
        title: "Demande envoyée",
        description: "Votre message a été envoyé avec succès. Nous vous répondrons dans les meilleurs délais.",
      });
      
      form.reset();
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gradient">Support Technique</h1>
          <p className="mt-2 text-gray-600">Nous sommes là pour vous aider avec toute question technique.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="mr-2 h-5 w-5 text-spirit-purple" />
                  Par téléphone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">+33 1 23 45 67 89</p>
                <p className="text-sm text-gray-500 mt-2">Lun-Ven, 9h-18h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="mr-2 h-5 w-5 text-spirit-purple" />
                  Par email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">support@spirittrack.com</p>
                <p className="text-sm text-gray-500 mt-2">Réponse sous 24-48h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="mr-2 h-5 w-5 text-spirit-purple" />
                  FAQ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">Consultez notre base de connaissances</p>
                <Button variant="link" className="p-0 h-auto text-spirit-purple mt-2">
                  Accéder à la FAQ
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-spirit-purple" />
                  Envoyer un message
                </CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous pour nous contacter directement.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom</FormLabel>
                            <FormControl>
                              <Input placeholder="Votre nom" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Votre email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sujet</FormLabel>
                          <FormControl>
                            <Input placeholder="Sujet de votre message" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Décrivez votre problème en détail..." 
                              className="min-h-[150px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <CardFooter className="flex justify-end px-0 pb-0">
                      <Button 
                        type="submit" 
                        className="bg-spirit-purple hover:bg-spirit-deep-purple"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SupportContactPage;
