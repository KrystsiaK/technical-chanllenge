import type { Rule } from '@/lib/validate';

export const PASSWORD_RULES = <T extends { password: string }>(): Rule<T>[] => [
    {
        field: 'password',
        message: 'Password is required',
        check: ({ password }) => !password,
    },
    {
        field: 'password',
        message: 'Password must be at least 8 characters',
        check: ({ password }) => password.length < 8,
    },
    {
        field: 'password',
        message: 'Password must contain at least one letter',
        check: ({ password }) => !/[A-Za-z]/.test(password),
    },
    {
        field: 'password',
        message: 'Password must contain at least one number',
        check: ({ password }) => !/\d/.test(password),
    },
    {
        field: 'password',
        message: 'Password must contain at least one special character',
        check: ({ password }) => !/[^A-Za-z0-9]/.test(password),
    },
];
