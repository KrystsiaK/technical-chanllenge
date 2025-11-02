import { User } from '@/features/users/interfaces/user';
import type { Rule } from '@/lib/validate';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


export const USER_RULES: Rule<User>[] = [
    {
        field: 'first_name',
        message: 'First name is required',
        check: ({ first_name }) => !first_name.trim(),
    },
    {
        field: 'first_name',
        message: 'First name must be at least 2 characters',
        check: ({ first_name }) => first_name.trim().length < 2,
    },
    {
        field: 'last_name',
        message: 'Last name is required',
        check: ({ last_name }) => !last_name.trim(),
    },
    {
        field: 'last_name',
        message: 'Last name must be at least 2 characters',
        check: ({ last_name }) => last_name.trim().length < 2,
    },
    {
        field: 'email',
        message: 'Email is required',
        check: ({ email }) => !email.trim(),
    },
    {
        field: 'email',
        message: 'Invalid email format',
        check: ({ email }) => !EMAIL_REGEX.test(email),
    },
];