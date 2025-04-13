
import React, { createContext, useContext, useEffect, useState } from "react";

// Define Auth types
type User = {
  id: string;
  email: string;
  displayName: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  checkUserExists: (email: string) => Promise<boolean>;
};

// Create Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock user database
  const [users, setUsers] = useState<User[]>([
    { id: "admin-1", email: "admin@example.com", displayName: "Admin" }
  ]);

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
      // Initialize with admin user
      localStorage.setItem("spiritTrackUsers", JSON.stringify(users));
    }
    
    setIsLoading(false);
  }, []);

  // Check if user exists in database
  const checkUserExists = async (email: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return users.some(u => u.email.toLowerCase() === email.toLowerCase());
  };

  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in our mock database
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (existingUser) {
        setUser(existingUser);
        localStorage.setItem("spiritTrackUser", JSON.stringify(existingUser));
      } else {
        throw new Error("User not found");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock register function
  const register = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
      
      if (userExists) {
        throw new Error("User already exists");
      }
      
      // Create new user
      const newUser = { 
        id: "user-" + Date.now(), 
        email,
        displayName
      };
      
      // Update users list
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      localStorage.setItem("spiritTrackUsers", JSON.stringify(updatedUsers));
      
      // Log in the new user
      setUser(newUser);
      localStorage.setItem("spiritTrackUser", JSON.stringify(newUser));
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Mock logout function
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
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, checkUserExists }}>
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
