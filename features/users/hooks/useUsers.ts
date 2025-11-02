'use client';
import { useCallback, useEffect, useState } from 'react';
import { userService } from '@/features/users/services/userService';
import { User } from '@/features/users/interfaces/user';
import { useAppToast } from '@/hooks/useToast';

export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { showError, showSuccess } = useAppToast();

    useEffect(() => {
        loadUsers();
    }, [page]);

    const handleError = (e: unknown, fallback: string): { success: false; error: string } => {
        const message = e instanceof Error ? e.message : String(e);
        const errorMessage = message || fallback;
        showError(errorMessage);
        return { success: false, error: errorMessage };
    };

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await userService.getUsers(page);
            setUsers(data.data);
            setTotalPages(data.total_pages);
        } catch (e: any) {
            return handleError(e, "Failed to load users");
        } finally {
            setLoading(false);
        }
    }, [page, showError]);

    const addUser = useCallback(async (
        user: Omit<User, 'id'>
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const newUser = await userService.createUser(user);
            setUsers(prev => [newUser, ...prev]);
            showSuccess('User created successfully');
            return { success: true };
        } catch (e: unknown) {
            return handleError(e, "Failed to create user");
        }
    }, [showError, showSuccess]);

    const updateUser = useCallback(async (
        id: number,
        updates: Partial<User>
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            const updated = await userService.updateUser(id, updates);
            setUsers(prev =>
                prev.map(u => (u.id === id ? { ...u, ...updated } : u))
            );
            showSuccess('User updated successfully');
            return { success: true };
        } catch (e: unknown) {
            return handleError(e, "Failed to update user");
        }
    }, [showError, showSuccess]);

    const deleteUser = useCallback(async (
        id: number
    ): Promise<{ success: boolean; error?: string }> => {
        try {
            await userService.deleteUser(id);
            setUsers(prev => prev.filter(u => u.id !== id));
            showSuccess('User deleted successfully');
            return { success: true };
        } catch (e: unknown) {
            return handleError(e, "Failed to delete user");
        }
    }, [showError, showSuccess]);

    return {
        users,
        page,
        totalPages,
        loading,
        error,
        setPage,
        addUser,
        updateUser,
        deleteUser,
        reload: loadUsers,
    };
}