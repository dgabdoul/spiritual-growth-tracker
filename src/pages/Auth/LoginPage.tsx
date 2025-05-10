
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, redirigez vers le tableau de bord
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Veuillez remplir tous les champs requis");
      return;
    }
    
    try {
      setLoading(true);
      await signIn(email, password, rememberMe);
      toast.success("Connexion réussie");
      navigate('/dashboard');
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast.error(
        "Erreur de connexion", 
        { description: error instanceof Error ? error.message : "Vérifiez vos identifiants" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte pour continuer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="vous@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-sm font-medium">
                  Mot de passe
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-primary hover:underline"
                >
                  Mot de passe oublié?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={setRememberMe}
              />
              <Label htmlFor="remember-me" className="text-sm">Se souvenir de moi</Label>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-center w-full">
            Pas encore de compte?{' '}
            <Link to="/register" className="text-primary hover:underline">
              S'inscrire
            </Link>
          </p>
          <div className="text-xs text-gray-500 text-center">
            <p>Nouveau compte? Vous pouvez vous connecter directement après votre inscription.</p>
            <p>Pas besoin de vérification par email.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
