'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from './types';
import { StudyMateStore } from './store';
import { createClient, isSupabaseConfigured } from './supabase/client';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSupabaseActive: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSupabaseActive, setIsSupabaseActive] = useState(false);

  useEffect(() => {
    const supabaseConfigured = isSupabaseConfigured();
    setIsSupabaseActive(supabaseConfigured);

    if (supabaseConfigured) {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          // fetch profile
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data }) => {
              if (data) {
                setUser(data as UserProfile);
              } else {
                // Fallback
                const local = StudyMateStore.getCurrentUser();
                setUser(local);
              }
              setIsLoading(false);
            });
        } else {
          // If no active session, check local store
          const local = StudyMateStore.getCurrentUser();
          setUser(local);
          setIsLoading(false);
        }
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (data) setUser(data as UserProfile);
        } else {
          setUser(StudyMateStore.getCurrentUser());
        }
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // Local fallback mode
      const current = StudyMateStore.getCurrentUser();
      setUser(current);
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.trim().toLowerCase();

    if (isSupabaseActive) {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password || 'studymate123',
        });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();
          if (profile) {
            setUser(profile as UserProfile);
            StudyMateStore.setCurrentUser(profile as UserProfile);
          }
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: unknown) {
        setIsLoading(false);
        const message = err instanceof Error ? err.message : 'Authentication failed';
        return { success: false, error: message };
      }
    }

    // Local / Offline authentication mode
    const profiles = StudyMateStore.getProfiles();
    const matched = profiles.find(p => p.email.toLowerCase() === cleanEmail);

    if (!matched) {
      setIsLoading(false);
      return {
        success: false,
        error: 'Account not found. Only authorized accounts created by the administrator may log in.',
      };
    }

    setUser(matched);
    StudyMateStore.setCurrentUser(matched);
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    if (isSupabaseActive) {
      const supabase = createClient();
      supabase.auth.signOut();
    }
    // Set to student account or clear
    const students = StudyMateStore.getStudents();
    if (students.length > 0) {
      setUser(students[0]);
      StudyMateStore.setCurrentUser(students[0]);
    }
  };

  const switchRole = (newRole: UserRole) => {
    const profiles = StudyMateStore.getProfiles();
    const target = profiles.find(p => p.role === newRole);
    if (target) {
      setUser(target);
      StudyMateStore.setCurrentUser(target);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: Boolean(user),
        isLoading,
        isSupabaseActive,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
