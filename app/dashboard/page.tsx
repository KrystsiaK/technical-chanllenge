'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { UsersTable } from '@/features/users/components/usersTable';
import { UserForm } from '@/features/users/components/userForm';
import { useUsers } from '@/features/users/hooks/useUsers';
import type { User } from '@/features/users/interfaces/user';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { UserModal } from '@/features/users/components/userModal';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading } = useAuth();
    const {
        users,
        page,
        totalPages,
        setPage,
        addUser,
        updateUser,
        deleteUser,
        loading,
    } = useUsers();

    const [showForm, setShowForm] = useState(false);
    const [mode, setMode] = useState<'create' | 'edit'>('create');
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<{
        open: boolean;
        userId: number | null;
    }>({ open: false, userId: null });

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.replace('/auth');
        }
    }, [isLoading, isAuthenticated, router]);


    const handleAddClick = () => {
        setMode('create');
        setEditingUser(null);
        setShowForm(true);
    };

    const handleEditClick = (user: User) => {
        setMode('edit');
        setEditingUser(user);
        setShowForm(true);
    };

    const handleAddUser = async (data: Omit<User, 'id'> | Partial<User>) => {
        if (!data) return { success: false, error: 'No data provided' };
        return await addUser(data as Omit<User, 'id'>);
    };

    const handleEditUser = async (data: Omit<User, 'id'> | Partial<User>) => {
        if (!editingUser) return { success: false, error: 'No user selected' };
        return await updateUser(editingUser.id, data);
    };

    const handleDeleteConfirm = async () => {
        const { userId } = confirmDelete;
        if (!userId) return;

        await deleteUser(userId);
        setConfirmDelete({ open: false, userId: null });
    };

    if (isLoading) {
        return (
            <div className="flex min-h-[calc(100vh-56px)] items-center justify-center">
                <div className="text-sm text-muted-foreground">Loading…</div>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6">

            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">User Management</h1>
                <Button onClick={handleAddClick}>Add User</Button>
            </div>


            {loading ? (
                <p className="text-sm text-muted-foreground">Loading users…</p>
            ) : (
                <UsersTable
                    users={users}
                    onEdit={handleEditClick}
                    onDelete={(id) => setConfirmDelete({ open: true, userId: id })}
                    page={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}


            <UserModal
                open={showForm}
                title={mode === 'create' ? 'Add New User' : 'Edit User'}
                onClose={() => setShowForm(false)}
            >
                <UserForm
                    mode={mode}
                    initialData={editingUser}
                    onSubmit={mode === 'create' ? handleAddUser : handleEditUser}
                    onClose={() => setShowForm(false)}
                />
            </UserModal>

            <AlertDialog
                open={confirmDelete.open}
                onOpenChange={(open) =>
                    setConfirmDelete((prev) => ({ ...prev, open }))
                }
            >
                <AlertDialogContent className="bg-white dark:bg-black">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you sure you want to delete this user?
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-destructive text-white hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}