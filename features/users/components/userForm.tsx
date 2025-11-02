'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from '@/hooks/useForm';
import { USER_RULES } from '../constants/validationRules/userRules';
import type { User } from '@/features/users/interfaces/user';
import type { Rule } from '@/lib/validate';
import { AvatarUploader } from '@/components/ui/avatar-uploader';
import { Field } from '@/components/ui/field';

interface Props {
    mode: 'create' | 'edit';
    initialData?: User | null;
    onSubmit: (
        data: Omit<User, 'id'> | Partial<User>
    ) => Promise<{ success: boolean; error?: string }>;
    onClose: () => void;
}

export const UserForm = ({ mode, initialData, onSubmit, onClose }: Props) => {
    const { values, setValues, handleChange, handleBlur, touched, errors, isValid } =
        useForm<Omit<User, 'id'>>(
            initialData || { first_name: '', last_name: '', email: '', avatar: '' },
            USER_RULES as Rule<Omit<User, 'id'>>[]
        );

    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isValid) return;
        setIsLoading(true);
        setSubmitError(null);

        try {
            const result = await onSubmit(values);
            if (result.success) onClose();
            else setSubmitError(result.error || 'Operation failed');
        } catch {
            setSubmitError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
        
            <AvatarUploader
                value={values.avatar}
                onChange={(base64) => setValues((prev) => ({ ...prev, avatar: base64 }))}
            />

            <Field
                label="First Name"
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.first_name ? errors?.first_name : null}
            />

            <Field
                label="Last Name"
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.last_name ? errors?.last_name : null}
            />

            <Field
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.email ? errors?.email : null}
            />

            {submitError && (
                <p className="text-sm text-destructive text-center">{submitError}</p>
            )}

            <div className="flex justify-end gap-2 pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={!isValid || isLoading}>
                    {isLoading
                        ? 'Saving…'
                        : mode === 'create'
                            ? 'Create'
                            : 'Save'}
                </Button>
            </div>
        </form>
    );
}