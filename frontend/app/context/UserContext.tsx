'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  name?: string;
  image?: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserContextType {
  user: UserProfile | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  updateUser: (updates: Partial<UserProfile>) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Extract user info from session
  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    if (session?.user) {
      const userProfile: UserProfile = {
        id: session.user.id,
        username: session.user.username,
        email: session.user.email,
        name: session.user.name || session.user.username,
        image: session.user.image || undefined,
        isVerified: session.user.isVerified || false,
      };
      setUser(userProfile);
    } else {
      setUser(null);
    }
    
    setIsLoading(false);
  }, [session, status]);

  const updateUser = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const refreshUser = async () => {
    if (!session?.user?.id) return;
    
    try {
      setIsLoading(true);
      // You can add API call here to fetch fresh user data if needed
      // const response = await fetch(`/api/user/${session.user.id}`);
      // const userData = await response.json();
      // setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: UserContextType = {
    user,
    session,
    isLoading: isLoading || status === 'loading',
    isAuthenticated: !!session?.user,
    updateUser,
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Hook specifically for authorized pages (throws if not authenticated)
export function useAuthenticatedUser(): Omit<UserContextType, 'isAuthenticated'> & { user: UserProfile } {
  const context = useUser();
  
  if (!context.isAuthenticated || !context.user) {
    throw new Error('useAuthenticatedUser can only be used in authenticated contexts');
  }
  
  return {
    ...context,
    user: context.user,
  };
}