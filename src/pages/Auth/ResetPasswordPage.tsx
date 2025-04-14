
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { ArrowLeft } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});
  
  const { resetPassword, validatePassword } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const validateForm = () => {
    const newErrors: {
      password?: string;
      confirmPassword?: string;
    } = {};
    let isValid = true;

    // Password validation
    if (!password) {
      newErrors.password = "Le mot de passe est requis";
      isValid = false;
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.message;
        isValid = false;
      }
    }

    // Confirm password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !token) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      const result = await resetPassword(token, password);
      
      if (result) {
        toast({
          title: "Mot de passe réinitialisé",
          description: "Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.",
          variant: "default",
        });
        navigate('/login?message=password_reset');
      } else {
        throw new Error("Impossible de réinitialiser le mot de passe");
      }
    } catch (error) {
      toast({
        title: "Échec de la réinitialisation",
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
              <CardTitle className="text-2xl text-center font-bold">Réinitialisation du mot de passe</CardTitle>
            </div>
            <CardDescription className="text-center">
              Définissez votre nouveau mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {isTokenValid ? (
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="password" className="text-sm font-medium leading-none">
                      Nouveau mot de passe
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`bg-white ${errors.password ? "border-red-500" : ""}`}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      Le mot de passe doit contenir au minimum 8 caractères, une majuscule, 
                      un chiffre et un caractère spécial
                    </p>
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
                      className={`bg-white ${errors.confirmPassword ? "border-red-500" : ""}`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-spirit-purple hover:bg-spirit-deep-purple"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'En cours...' : 'Réinitialiser le mot de passe'}
                  </Button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center">
                <p className="text-red-500">Ce lien de réinitialisation est invalide ou a expiré.</p>
                <p className="mt-2">Veuillez demander un nouveau lien de réinitialisation.</p>
                <Button
                  className="mt-4 bg-spirit-purple hover:bg-spirit-deep-purple"
                  onClick={() => navigate('/forgot-password')}
                >
                  Demander un nouveau lien
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-sm text-center text-gray-500">
              <Link to="/login" className="text-spirit-purple hover:text-spirit-deep-purple font-medium">
                Retour à la connexion
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
