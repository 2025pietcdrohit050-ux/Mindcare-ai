import React, { createContext, useContext, useState } from 'react';
import type { UserProfile } from '../types';
import { storageService } from '../utils/storage';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  login: (email: string, role?: 'patient' | 'caregiver') => void;
  logout: () => void;
  switchRole: (role: 'patient' | 'caregiver') => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetAllDemoData: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => storageService.getUserProfile());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('mindmate_auth') !== 'false';
  });

  const login = (email: string, role: 'patient' | 'caregiver' = 'patient') => {
    const current = storageService.getUserProfile();
    const updated: UserProfile = {
      ...current,
      email,
      role,
      name: role === 'caregiver' ? (current.caregiverName || 'Dr. Sunita Sharma') : current.name,
    };
    storageService.saveUserProfile(updated);
    setUser(updated);
    setIsAuthenticated(true);
    localStorage.setItem('mindmate_auth', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('mindmate_auth', 'false');
  };

  const switchRole = (role: 'patient' | 'caregiver') => {
    const current = storageService.getUserProfile();
    const updated: UserProfile = {
      ...current,
      role,
    };
    storageService.saveUserProfile(updated);
    setUser(updated);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const current = storageService.getUserProfile();
    const updated = { ...current, ...updates };
    storageService.saveUserProfile(updated);
    setUser(updated);
  };

  const resetAllDemoData = () => {
    storageService.resetToDemoData();
    setUser(storageService.getUserProfile());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        switchRole,
        updateProfile,
        resetAllDemoData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
