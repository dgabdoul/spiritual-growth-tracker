import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';

interface ProfileUpdateData {
  display_name?: string;
  avatar_url?: string;
  is_public?: boolean;
  [key: string]: any; // Allow additional profile fields
}

interface WebhookSettings {
  whatsapp_url: string | null;
  telegram_url: string | null;
  events: string[];
}

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
  updateProfile: (data: ProfileUpdateData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileError, setProfileError] = useState<boolean>(false);
  const navigate = useNavigate();

  // Function to send webhook notifications
  const sendWebhookNotification = async (event: string, payload: any = {}) => {
    if (!user) return;
    
    try {
      // Use type assertion to handle webhook_settings table
      const { data: settings, error } = await supabase
        .from('webhook_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();
        
      if (error || !settings) {
        console.error("Could not fetch webhook settings:", error);
        return;
      }
        
      if (!settings.events?.includes(event)) return;
      
      const messageBody = JSON.stringify({
        event,
        user_id: user.id,
        timestamp: new Date().toISOString(),
        ...payload
      });
      
      // Send to WhatsApp if configured
      if (settings.whatsapp_url) {
        try {
          await fetch(settings.whatsapp_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors',
            body: messageBody
          });
        } catch (error) {
          console.error("Error sending WhatsApp webhook:", error);
        }
      }
      
      // Send to Telegram if configured
      if (settings.telegram_url) {
        try {
          await fetch(settings.telegram_url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            mode: 'no-cors',
            body: messageBody
          });
        } catch (error) {
          console.error("Error sending Telegram webhook:", error);
        }
      }
    } catch (error) {
      console.error("Error in webhook notification:", error);
    }
  };

  // Fonction pour récupérer le profil avec gestion d'erreur améliorée
  const fetchProfile = async (userId: string) => {
    try {
      // Limiter le nombre de colonnes sélectionnées pour améliorer les performances
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, email, role, avatar_url, last_sign_in_at')
        .eq('id', userId)
        .maybeSingle();
        
      if (error) {
        console.error("Erreur lors de la récupération du profil:", error);
        setProfileError(true);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Exception lors de la récupération du profil:", error);
      setProfileError(true);
      return null;
    }
  };

  useEffect(() => {
    // Configurer l'écouteur d'événements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Si l'utilisateur est connecté, récupérer son profil
        if (session?.user && !profileError) {
          const profileData = await fetchProfile(session.user.id);
          if (profileData) {
            setProfile(profileData);
            setIsAdmin(profileData?.role === 'admin');
          }
          
          // Send webhook notification on login
          if (event === 'SIGNED_IN') {
            // Use setTimeout to avoid blocking the auth flow
            setTimeout(() => {
              sendWebhookNotification('login', { 
                email: session.user.email,
                login_time: new Date().toISOString()
              });
            }, 0);
          }
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
      }
    );

    // Récupérer la session actuelle avec un délai minimal
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          if (profileData) {
            setProfile(profileData);
            setIsAdmin(profileData?.role === 'admin');
          }
        }
      } catch (error) {
        console.error("Erreur lors de l'initialisation de l'auth:", error);
      } finally {
        // Toujours terminer le chargement même en cas d'erreur
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [profileError]);

  const updateProfile = async (data: ProfileUpdateData): Promise<void> => {
    if (!user) throw new Error("User must be logged in to update profile");
    
    try {
      // Update the local profile state optimistically
      setProfile(currentProfile => ({
        ...currentProfile,
        ...data
      }));
      
      // Update the profile in the database
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Refresh the profile data from the database
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
      
      // Send webhook notification for profile update
      sendWebhookNotification('profile_update', { updated_fields: Object.keys(data) });
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
        // Remove email verification - no emailRedirectTo parameter
      },
    });
    
    if (error) throw error;
    
    // If signup is successful, show success message
    if (data.user) {
      toast.success("Compte créé avec succès", {
        description: "Vous pouvez maintenant vous connecter directement."
      });
      
      // Send webhook notification for signup
      sendWebhookNotification('signup', { 
        email, 
        display_name: displayName 
      });
    }
  };

  const signIn = async (email: string, password: string, rememberMe = false) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Si l'option "Se souvenir de moi" est activée
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      // Webhook notification is handled in the onAuthStateChange event
    } catch (error) {
      console.error("Erreur de connexion dans AuthContext:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      localStorage.removeItem('rememberMe');
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      throw error;
    }
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
      
      // Send webhook notification for password change
      sendWebhookNotification('password_change', {
        timestamp: new Date().toISOString()
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
        updateProfile,
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
