'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/authService';
import { authStorage } from '@/features/auth/services/authStorage';
import { useAppToast } from '@/hooks/useToast';

export interface AuthUser {
    username: string;
    email: string;
}

interface AuthContextValue {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    register: (email: string, password: string, username: string) => Promise<{ success: boolean; error?: string }>;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<{ success: boolean; error?: string }>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { showError, showSuccess } = useAppToast();

    useEffect(() => {
        const token = authStorage.getToken();
        const email = authStorage.getEmail();
        const username = authStorage.getUserName();
        if (token && email) {
            setIsAuthenticated(true);
            setUser({ email, username: username || 'Dear User' });
        }
        setIsLoading(false);
    }, []);

    const register = useCallback(
        async (email: string, password: string, username: string) => {
            const result = await authService.register({ email, password, username });

            if (result.success) {
                setIsAuthenticated(true);
                setUser({ email, username });
                router.replace('/main');
                showSuccess('Registration successful');
            } else if (result.error) {
                showError(result.error);
            }

            return result;
        },
        [router, showError, showSuccess]
    );

    const login = useCallback(
        async (email: string, password: string) => {
            const result = await authService.login({ email, password });

            if (result.success) {
                setIsAuthenticated(true);
                setUser({
                    email,
                    username: authStorage.getUserName?.() || 'User',
                });
                router.replace('/main');
                showSuccess('Login successful');
            } else if (result.error) {
                showError(result.error);
            }

            return result;
        },
        [router, showError, showSuccess]
    );

    const logout = useCallback(async () => {
        const result = await authService.logout();

        if (result.success) {
            setIsAuthenticated(false);
            setUser(null);
            router.replace('/auth');
            showSuccess('Logged out successfully');
        } else if (result.error) {
            showError(result.error);
        }

        return result;
    }, [router, showError, showSuccess]);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

