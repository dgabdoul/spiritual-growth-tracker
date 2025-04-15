
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const SupportContactPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user ? (profile?.display_name || user.email?.split('@')[0] || '') : '',
    email: user ? user.email || '' : '',
    subject: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simuler un délai d'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Support request submitted:', formData);
      
      toast({
        title: "Message envoyé",
        description: "Nous avons bien reçu votre demande et y répondrons dès que possible.",
      });
      
      // Réinitialiser le formulaire
      setFormData(prev => ({
        ...prev,
        subject: '',
        message: ''
      }));
    } catch (error) {
      console.error('Error submitting support request:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 container max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-2">Contactez notre support</h1>
          <p className="text-gray-600 mb-8">
            Vous avez une question ou rencontrez un problème ? Notre équipe est là pour vous aider.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block font-medium text-gray-700">Nom</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block font-medium text-gray-700">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="subject" className="block font-medium text-gray-700">Sujet</label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="block font-medium text-gray-700">Message</label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                required
                className="resize-y"
              />
            </div>
            
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-spirit-purple hover:bg-spirit-deep-purple"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </Button>
            </div>
          </form>
          
          <div className="mt-10 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-semibold mb-4">Autres façons de nous contacter</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
                <p className="text-gray-600">support@spiritualtracker.com</p>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Heures d'ouverture</h4>
                <p className="text-gray-600">Lun-Ven: 9h-18h (CET)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportContactPage;
