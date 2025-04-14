
import React, { createContext, useContext, useEffect, useState } from "react";
import bcrypt from "bcryptjs";

// Define Auth types
type User = {
  id: string;
  email: string;
  displayName: string;
  passwordHash?: string;
  loginAttempts?: number;
  lockedUntil?: Date;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUserExists: (email: string) => Promise<boolean>;
  requestPasswordReset: (email: string) => Promise<boolean>;
  resetPassword: (token: string, newPassword: string) => Promise<boolean>;
  validatePassword: (password: string) => { isValid: boolean; message: string };
};

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Password reset tokens storage
type PasswordResetToken = {
  email: string;
  token: string;
  expiresAt: Date;
};

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resetTokens, setResetTokens] = useState<PasswordResetToken[]>([]);
  
  // Mock user database with password hashes
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Check local storage for user info
    const savedUser = localStorage.getItem("spiritTrackUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Load mock users from localStorage if available
    const savedUsers = localStorage.getItem("spiritTrackUsers");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Initialize with admin user (password: Admin123!)
      const adminUser = { 
        id: "admin-1", 
        email: "admin@example.com", 
        displayName: "Admin",
        passwordHash: bcrypt.hashSync("Admin123!", 10),
        loginAttempts: 0
      };
      
      setUsers([adminUser]);
      localStorage.setItem("spiritTrackUsers", JSON.stringify([adminUser]));
    }

    // Load reset tokens if any
    const savedTokens = localStorage.getItem("spiritTrackResetTokens");
    if (savedTokens) {
      setResetTokens(JSON.parse(savedTokens));
    }
    
    setIsLoading(false);
  }, []);

  // Password validation
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return { isValid: false, message: "Le mot de passe doit contenir au moins 8 caractères" };
    }
    
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, message: "Le mot de passe doit contenir au moins une majuscule" };
    }
    
    if (!/[0-9]/.test(password)) {
      return { isValid: false, message: "Le mot de passe doit contenir au moins un chiffre" };
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { isValid: false, message: "Le mot de passe doit contenir au moins un caractère spécial" };
    }
    
    return { isValid: true, message: "Mot de passe valide" };
  };

  // Check if user exists in database
  const checkUserExists = async (email: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  };

  // Login with rate limiting and password check
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in our mock database
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!existingUser) {
        throw new Error("Identifiants incorrects");
      }
      
      // Check if account is locked
      if (existingUser.lockedUntil && new Date(existingUser.lockedUntil) > new Date()) {
        const minutesLeft = Math.ceil((new Date(existingUser.lockedUntil).getTime() - new Date().getTime()) / (1000 * 60));
        throw new Error(`Compte temporairement verrouillé. Réessayez dans ${minutesLeft} minutes.`);
      }
      
      // Verify password
      const passwordMatch = await bcrypt.compare(password, existingUser.passwordHash || "");
      
      if (!passwordMatch) {
        // Increment login attempts
        const updatedUsers = users.map(u => {
          if (u.id === existingUser.id) {
            const attempts = (u.loginAttempts || 0) + 1;
            // Lock account after 5 failed attempts for 15 minutes
            const lockedUntil = attempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : undefined;
            return {...u, loginAttempts: attempts, lockedUntil};
          }
          return u;
        });
        
        setUsers(updatedUsers);
        localStorage.setItem("spiritTrackUsers", JSON.stringify(updatedUsers));
        
        throw new Error("Identifiants incorrects");
      }
      
      // Reset login attempts on successful login
      const updatedUsers = users.map(u => {
        if (u.id === existingUser.id) {
          const { passwordHash, ...userWithoutHash } = u;
          return {...userWithoutHash, loginAttempts: 0, lockedUntil: undefined};
        }
        return u;
      });
      
      setUsers(updatedUsers);
      localStorage.setItem("spiritTrackUsers", JSON.stringify(updatedUsers));
      
      // Remove password hash from user object before storing in state
      const { passwordHash, ...userWithoutHash } = existingUser;
      setUser(userWithoutHash);
      localStorage.setItem("spiritTrackUser", JSON.stringify(userWithoutHash));
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register with password validation
  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate password
      const validation = validatePassword(password);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
      
      // Check if user already exists
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (userExists) {
        throw new Error("Cette adresse email est déjà utilisée");
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);
      
      // Create new user
      const newUser = { 
        id: "user-" + Date.now(), 
        email,
        displayName,
        passwordHash,
        loginAttempts: 0
      };
      
      // Update users list
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem("spiritTrackUsers", JSON.stringify(updatedUsers));
      
      // Log in the new user (without passwordHash)
      const { passwordHash: _, ...userWithoutHash } = newUser;
      setUser(userWithoutHash);
      localStorage.setItem("spiritTrackUser", JSON.stringify(userWithoutHash));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (email: string): Promise<boolean> => {
    try {
      // Check if user exists
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (!userExists) {
        // Return true even if user doesn't exist to prevent user enumeration
        return true;
      }
      
      // Generate token
      const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      
      // Set expiration (15 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15);
      
      // Save token
      const newToken = { email, token, expiresAt };
      const updatedTokens = [...resetTokens.filter(t => t.email !== email), newToken];
      setResetTokens(updatedTokens);
      localStorage.setItem("spiritTrackResetTokens", JSON.stringify(updatedTokens));
      
      console.log("Password reset token for", email, ":", token);
      
      // In a real app, this would send an email
      return true;
    } catch (error) {
      console.error("Password reset request error:", error);
      return false;
    }
  };

  // Reset password
  const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
    try {
      // Validate password
      const validation = validatePassword(newPassword);
      if (!validation.isValid) {
        throw new Error(validation.message);
      }
      
      // Find token
      const resetToken = resetTokens.find(t => t.token === token);
      if (!resetToken) {
        throw new Error("Token invalide ou expiré");
      }
      
      // Check if token is expired
      if (new Date(resetToken.expiresAt) < new Date()) {
        throw new Error("Token expiré");
      }
      
      // Find user
      const userIndex = users.findIndex(u => u.email.toLowerCase() === resetToken.email.toLowerCase());
      if (userIndex === -1) {
        throw new Error("Utilisateur non trouvé");
      }
      
      // Update password
      const passwordHash = await bcrypt.hash(newPassword, 10);
      const updatedUsers = [...users];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        passwordHash,
        loginAttempts: 0,
        lockedUntil: undefined
      };
      
      setUsers(updatedUsers);
      localStorage.setItem("spiritTrackUsers", JSON.stringify(updatedUsers));
      
      // Remove used token
      const updatedTokens = resetTokens.filter(t => t.token !== token);
      setResetTokens(updatedTokens);
      localStorage.setItem("spiritTrackResetTokens", JSON.stringify(updatedTokens));
      
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      localStorage.removeItem("spiritTrackUser");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout, 
      checkUserExists,
      requestPasswordReset,
      resetPassword,
      validatePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
