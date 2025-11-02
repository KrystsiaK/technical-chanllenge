'use client';

import { FC, PropsWithChildren } from 'react';
import { ThemeProvider } from '@/features/theme/providers/theme-provider';
import { AuthProvider } from '@/features/auth/context/AuthContext';

export const Providers: FC<PropsWithChildren> = ({ children }) => (
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
    >
        <AuthProvider>
            {children}
        </AuthProvider>
    </ThemeProvider>
);