// src/contexts/AuthContext.tsx

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
// Import the new logout function from your API service
import { logoutUser } from '../services/chatApi';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  register: (name: string, email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>; // Logout is now an async function that returns a Promise
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await fetch('/api/user');
        if (res.ok) {
          const userData = await res.json();
          if (userData) {
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Session check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }
    return response.json();
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }
    const data = await response.json();
    setUser(data.user);
    return data;
  };

  // --- THIS IS THE CORRECTED LOGOUT FUNCTION ---
  const logout = async () => {
    try {
      // 1. Call the backend API to clear the HttpOnly cookie
      await logoutUser();
      // 2. Clear the user from the React app state
      setUser(null);
      // 3. Optional but recommended: Redirect to the login page
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed:", error);
      // If the API fails, you might still want to clear the local state
      setUser(null);
    }
  };

  const value = { user, loading, register, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};