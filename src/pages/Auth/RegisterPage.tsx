
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const RegisterPage: React.FC = () => {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, checkUserExists } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if we have an email from the login redirect
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Les mots de passe ne correspondent pas",
        description: "Veuillez vous assurer que les deux mots de passe correspondent.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Check if user already exists
      const userExists = await checkUserExists(email);
      
      if (userExists) {
        toast({
          title: "Compte déjà existant",
          description: "Un compte avec cette adresse email existe déjà. Veuillez vous connecter.",
          variant: "destructive",
        });
        navigate('/login');
        return;
      }
      
      await register(email, password, displayName);
      toast({
        title: "Compte créé !",
        description: "Votre compte a été créé avec succès.",
        variant: "default",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Échec de l'inscription",
        description: "Une erreur est survenue lors de la création de votre compte.",
        variant: "destructive",
      });
      console.error('Registration error:', error);
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
            <CardTitle className="text-2xl text-center font-bold">Créer un compte</CardTitle>
            <CardDescription className="text-center">
              Saisissez vos informations pour créer votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
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
                    required
                    className="bg-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="displayName" className="text-sm font-medium leading-none">
                    Nom et prénom
                  </label>
                  <Input
                    id="displayName"
                    type="text"
                    placeholder="Jean Dupont"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="password" className="text-sm font-medium leading-none">
                    Mot de passe
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                    Confirmer le mot de passe
                  </label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-spirit-purple hover:bg-spirit-deep-purple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Création en cours...' : 'Créer un compte'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-gray-500">
              Vous avez déjà un compte ?{' '}
              <Link to="/login" className="text-spirit-purple hover:text-spirit-deep-purple font-medium">
                Se connecter
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
