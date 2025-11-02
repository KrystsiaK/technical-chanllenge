'use client';

import { toast } from 'sonner';

export const useAppToast = () => {
    const showError = (message: string) =>
        toast.error(message || 'Something went wrong');

    const showSuccess = (message: string) =>
        toast.success(message || 'Action completed successfully');

    const showInfo = (message: string) =>
        toast(message, { description: 'Info', duration: 3000 });

    return { showError, showSuccess, showInfo };
}