
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, checkUserExists } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check if user exists first
      const userExists = await checkUserExists(email);
      
      if (!userExists) {
        // Redirect to register if user doesn't exist
        toast({
          title: "Compte non trouvé",
          description: "Aucun compte n'existe avec cette adresse email. Veuillez vous inscrire.",
          variant: "destructive",
        });
        navigate('/register', { state: { email } });
        return;
      }
      
      // Login if user exists
      await login(email, password);
      toast({
        title: "Connexion réussie !",
        description: "Vous êtes maintenant connecté.",
        variant: "default",
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Échec de connexion",
        description: "Veuillez vérifier vos identifiants et réessayer.",
        variant: "destructive",
      });
      console.error('Login error:', error);
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
            <CardTitle className="text-2xl text-center font-bold">Connexion</CardTitle>
            <CardDescription className="text-center">
              Entrez votre email et mot de passe pour accéder à votre compte
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
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium leading-none">
                      Mot de passe
                    </label>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-white"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-spirit-purple hover:bg-spirit-deep-purple"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-gray-500">
              Vous n'avez pas de compte ?{' '}
              <Link to="/register" className="text-spirit-purple hover:text-spirit-deep-purple font-medium">
                S'inscrire
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
