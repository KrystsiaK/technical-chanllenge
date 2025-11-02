'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from '@/hooks/useForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { LoginForm as LoginFormType } from '@/features/auth/interfaces/forms';
import { LOGIN_RULES } from '@/features/auth/constants/validationRules/loginRules';
import type { Rule } from '@/lib/validate';
import { Field } from '@/components/ui/field';

export const LoginForm = () => {
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { values, handleChange, handleBlur, touched, errors, isValid } =
        useForm<LoginFormType>(
            {
                email: '',
                password: '',
            },
            LOGIN_RULES as Rule<LoginFormType>[]
        );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(null);
        if (!isValid) return;

        try {
            setIsLoading(true);
            const result = await login(values.email, values.password);

            if (!result.success) {
                setSubmitError(result.error || 'Invalid credentials');
            }
        } catch {
            setSubmitError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 max-w-sm mx-auto w-full p-4 border rounded-md bg-card"
        >
            <h2 className="text-xl font-semibold text-center">Sign In</h2>

            <Field
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.email ? errors?.email : null}
            />

            <Field
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.password ? errors?.password : null}
            />

            {submitError && (
                <p className="text-sm text-center text-destructive">{submitError}</p>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isLoading}
            >
                {isLoading ? 'Signing in…' : 'Sign In'}
            </Button>
        </form>
    );
};