'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from '@/hooks/useForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import type { RegisterForm as RegisterFormType } from '@/features/auth/interfaces/forms';
import { REGISTER_RULES } from '../constants/validationRules/registrationRules';
import type { Rule } from '@/lib/validate';
import { Field } from '@/components/ui/field';

export const RegisterForm = () => {
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { values, handleChange, handleBlur, touched, errors, isValid } =
        useForm<RegisterFormType>(
            {
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
            },
            REGISTER_RULES as Rule<RegisterFormType>[]
        );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError(null);

        if (!isValid) return;

        try {
            setIsLoading(true);
            const result = await register(values.email, values.password, values.username);

            if (!result.success) {
                setSubmitError(result.error || 'Registration failed');
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
            <h2 className="text-xl font-semibold text-center">Create Account</h2>

            <Field
                label="First name"
                name="username"
                type="text"
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.username ? errors?.username : null}
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

            <Field
                label="Password"
                name="password"
                type="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.password ? errors?.password : null}
            />

            <Field
                label="Confirm password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                errors={touched.confirmPassword ? errors?.confirmPassword : null}
            />

            {submitError && (
                <p className="text-sm text-center text-destructive">{submitError}</p>
            )}

            <Button
                type="submit"
                className="w-full"
                disabled={!isValid || isLoading}
            >
                {isLoading ? 'Creating…' : 'Register'}
            </Button>
        </form>
    );
};