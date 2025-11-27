import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      // Check for OAuth callback params
      const params = new URLSearchParams(window.location.search);
      const oauthToken = params.get('token');
      const oauthError = params.get('error');

      if (oauthToken) {
        try {
          // Temporarily set token to verify user
          api.setToken(oauthToken);
          
          // Fetch user details from backend using the token
          const userProfile = await api.request<User>('/auth/me');
          
          if (userProfile) {
            setUser(userProfile);
            localStorage.setItem('user', JSON.stringify(userProfile));
            setIsAuthenticated(true);
            
            // Clean URL without reloading
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            throw new Error('Failed to load user profile');
          }
        } catch (e) {
          console.error("OAuth initialization failed:", e);
          api.removeToken();
          setError("Authentication failed. Please try again.");
        }
      } else if (oauthError) {
        console.error("OAuth Error:", oauthError);
        setError("Social login failed. Please try again.");
      } else {
        // Standard LocalStorage check
        const token = api.getToken();
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          try {
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
          } catch (e) {
            api.removeToken();
          }
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await api.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: credentials
    });

    if (response.success && response.token && response.user) {
      api.setToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setIsAuthenticated(true);
      setError(null);
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const register = async (data: RegisterRequest) => {
    const response = await api.request<AuthResponse>('/auth/signup', {
      method: 'POST',
      body: data
    });

    if (!response.success) {
      throw new Error(response.message || 'Registration failed');
    }
  };

  const logout = () => {
    api.removeToken();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};