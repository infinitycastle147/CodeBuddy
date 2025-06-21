'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { Session } from 'next-auth';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  name?: string;
  image?: string;
  isVerified: boolean;
}

export interface UseAuthReturn {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (provider?: string) => Promise<void>;
  logout: () => Promise<void>;
  session: Session | null;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = useCallback(async (provider: string = 'credentials') => {
    try {
      const result = await signIn(provider, { 
        redirect: false,
        callbackUrl: '/dashboard' 
      });
      
      if (result?.ok && !result?.error) {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: '/' 
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, [router]);

  const user: AuthUser | null = session?.user ? {
    id: session.user.id,
    username: session.user.username || session.user.email || '',
    email: session.user.email || '',
    name: session.user.name || undefined,
    image: session.user.image || undefined,
    isVerified: session.user.isVerified || false,
  } : null;

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: !!session?.user,
    login,
    logout,
    session,
  };
}