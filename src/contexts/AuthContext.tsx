import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: any | null;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<boolean>;
  validatePassword: (password: string) => { isValid: boolean; message: string };
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(async () => {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            setProfile(profile);
            setIsAdmin(profile?.role === 'admin');
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            setProfile(data);
            setIsAdmin(data?.role === 'admin');
          });
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, displayName: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
        // This is the key change - disable email verification
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    
    if (error) throw error;
    
    // If signup was successful but we're waiting for email confirmation
    if (data.user && !data.session) {
      toast.success("Compte créé avec succès", {
        description: "Vous pouvez maintenant vous connecter directement."
      });
    }
  };

  const signIn = async (email: string, password: string, rememberMe = false) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
      options: {
        persistSession: true, // Toujours enregistrer la session
      }
    });
    
    if (error) throw error;
    
    // Si l'option "Se souvenir de moi" est activée, nous la gérons par défaut avec Supabase
    // qui utilise les JWT stockés dans le localStorage
    if (rememberMe) {
      // Supabase gère déjà la persistance de session par défaut
      // Mais nous pourrions ajouter une logique supplémentaire si nécessaire
      localStorage.setItem('rememberMe', 'true');
    } else {
      // Si l'utilisateur ne veut pas être mémorisé, nous ne faisons rien de spécial
      // mais nous pourrions implémenter une logique pour effacer la session après une période donnée
      localStorage.removeItem('rememberMe');
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    localStorage.removeItem('rememberMe');
    navigate('/login');
  };

  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error("Erreur lors de l'envoi de l'email de réinitialisation.", {
          description: error.message
        });
        return false;
      }
      
      toast.success("Email de réinitialisation envoyé", {
        description: "Si un compte existe avec cette adresse email, vous recevrez des instructions pour réinitialiser votre mot de passe."
      });
      return true;
    } catch (error) {
      console.error('Error requesting password reset:', error);
      return false;
    }
  };

  const resetPassword = async (newPassword: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) {
        toast.error("Erreur lors de la réinitialisation du mot de passe", {
          description: error.message
        });
        return false;
      }
      
      toast.success("Mot de passe mis à jour avec succès", {
        description: "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."
      });
      
      return true;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    }
  };

  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return { isValid: false, message: "Le mot de passe doit contenir au moins 8 caractères" };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: "Le mot de passe doit contenir au moins une lettre majuscule" };
    }
    
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: "Le mot de passe doit contenir au moins un chiffre" };
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      return { isValid: false, message: "Le mot de passe doit contenir au moins un caractère spécial" };
    }
    
    return { isValid: true, message: "" };
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        signIn,
        signUp,
        signOut,
        loading,
        requestPasswordReset,
        resetPassword,
        validatePassword,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
