
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { AlertCircle, ArrowLeft, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { requestPasswordReset } = useAuth();
  const { toast } = useToast();

  const validateForm = () => {
    if (!email.trim()) {
      setError("L'email est requis");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Format d'email invalide");
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const result = await requestPasswordReset(email);
      
      if (result) {
        setSubmitted(true);
        toast({
          title: "Email envoyé",
          description: "Si un compte existe avec cette adresse, vous recevrez un email avec les instructions pour réinitialiser votre mot de passe.",
          variant: "default",
        });
      } else {
        throw new Error("Impossible d'envoyer l'email de réinitialisation");
      }
    } catch (error) {
      toast({
        title: "Échec de l'envoi",
        description: error instanceof Error ? error.message : "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <div className="flex items-center mb-2">
              <Link to="/login" className="text-spirit-purple hover:text-spirit-deep-purple mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Link>
              <CardTitle className="text-2xl text-center font-bold">Mot de passe oublié</CardTitle>
            </div>
            <CardDescription className="text-center">
              {!submitted 
                ? "Entrez votre adresse email pour recevoir un lien de réinitialisation" 
                : "Consultez votre boîte mail pour réinitialiser votre mot de passe"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-sm font-medium leading-none">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vous@exemple.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`bg-white ${error ? "border-red-500" : ""}`}
                    />
                    {error && (
                      <p className="text-sm text-red-500">{error}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-spirit-purple hover:bg-spirit-deep-purple"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-4">
                <Alert variant="default" className="bg-green-50 border-green-200">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Si un compte existe avec cette adresse email, vous recevrez un email contenant un lien pour réinitialiser votre mot de passe.
                    <p className="mt-2 text-gray-600 text-sm">
                      Note: Dans cette démo, consultez la console du navigateur pour voir le token de réinitialisation.
                    </p>
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-gray-500">
              {submitted ? (
                <Link to="/login" className="text-spirit-purple hover:text-spirit-deep-purple font-medium">
                  Retour à la connexion
                </Link>
              ) : (
                <>
                  Vous vous souvenez de votre mot de passe ?{' '}
                  <Link to="/login" className="text-spirit-purple hover:text-spirit-deep-purple font-medium">
                    Se connecter
                  </Link>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
