'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/hooks/useAuth';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function MainPage() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/auth');
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="flex min-h-[calc(100dvh-56px)] items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading…</div>
            </div>
        );
    }

    if (!isAuthenticated) return null;

    return (
        <main className="relative flex min-h-[calc(100dvh-56px)] items-center justify-center overflow-hidden bg-[#00002E]">
            <Image
                src="/main-bg.webp"
                alt="Background globe pattern"
                fill
                priority
                className="object-cover opacity-40"
            />

            <div className="absolute inset-0 bg-[#00002E]/80" />

            <div className="relative z-10 text-center text-white px-6 max-w-3xl">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                    1GLOBAL device and communication solutions connect your people,
                    devices and networks instantly, anywhere, at scale
                </h1>
                <Button
                    size="lg"
                    className="cursor-pointer mt-2 bg-primary hover:bg-primary/90 text-white"
                    onClick={() => router.push('/dashboard')}
                >
                    Go to Dashboard
                </Button>
            </div>
        </main>
    );
}