'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoginForm } from '@/features/auth/components/LoginFrom';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import { useAuth } from '@/features/auth/hooks/useAuth';

export default function AuthPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const [mode, setMode] = useState<'login' | 'register'>('login');

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            router.replace('/main');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-muted-foreground">Checking authentication…</p>
            </div>
        );
    }

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="flex items-center justify-center min-h-screen py-12">
            <div className="w-full max-w-sm space-y-4 border rounded-md bg-card shadow">
                <Tabs
                    className="p-4"
                    value={mode}
                    onValueChange={(v) => setMode(v as 'login' | 'register')}
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Sign In</TabsTrigger>
                        <TabsTrigger value="register">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <LoginForm />
                    </TabsContent>

                    <TabsContent value="register">
                        <RegisterForm />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}