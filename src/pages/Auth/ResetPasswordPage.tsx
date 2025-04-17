
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { LockIcon, CheckIcon, AlertTriangleIcon } from 'lucide-react';

const passwordStrengthCalculator = (password: string): number => {
  if (!password) return 0;
  let strength = 0;
  if (password.length >= 8) strength += 25;
  if (/[A-Z]/.test(password)) strength += 25;
  if (/[0-9]/.test(password)) strength += 25;
  if (/[^A-Za-z0-9]/.test(password)) strength += 25;
  return strength;
};

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [strength, setStrength] = useState(0);
  const [resetComplete, setResetComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { resetPassword, validatePassword } = useAuth();
  const navigate = useNavigate();

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPassword(value);
    setStrength(passwordStrengthCalculator(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    const validation = validatePassword(newPassword);
    if (!validation.isValid) {
      setError(validation.message);
      return;
    }

    setIsLoading(true);

    try {
      const success = await resetPassword(newPassword);
      if (success) {
        setResetComplete(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('Error:', error);
      setError("Une erreur s'est produite lors de la réinitialisation du mot de passe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Réinitialiser votre mot de passe</CardTitle>
          <CardDescription>
            Créez un nouveau mot de passe sécurisé pour votre compte
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!resetComplete ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="new-password"
                    type="password"
                    className="pl-10"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Progress value={strength} className="h-2" />
                  <p className="text-xs text-gray-500">
                    {strength === 0 && "Le mot de passe doit contenir au moins 8 caractères"}
                    {strength === 25 && "Faible"}
                    {strength === 50 && "Moyen"}
                    {strength === 75 && "Bon"}
                    {strength === 100 && "Fort"}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <div className="relative">
                  <LockIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirm-password"
                    type="password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm font-medium text-red-500 flex items-center space-x-1">
                  <AlertTriangleIcon className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button type="submit" className="w-full bg-spirit-purple hover:bg-spirit-deep-purple" disabled={isLoading}>
                {isLoading ? "Réinitialisation en cours..." : "Réinitialiser le mot de passe"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="flex justify-center">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckIcon className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="text-lg font-medium">Mot de passe mis à jour</h3>
              <p className="text-sm text-gray-500">
                Votre mot de passe a été réinitialisé avec succès. Vous allez être redirigé vers la page de connexion...
              </p>
              <Button 
                onClick={() => navigate('/login')} 
                className="mt-4 bg-spirit-purple hover:bg-spirit-deep-purple"
              >
                Aller à la page de connexion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
