import type { Rule } from '@/lib/validate';
import type { RegisterForm } from '@/features/auth/interfaces/forms';
import { EMAIL_RULES } from '@/features/auth/constants/validationRules/emailRules';
import { PASSWORD_RULES } from '@/features/auth/constants/validationRules/passwordRules';

export const REGISTER_RULES: Rule<RegisterForm>[] = [
    {
        field: 'username',
        message: 'First name is required',
        check: ({ username }) => !username.trim(),
    },
    {
        field: 'username',
        message: 'First name must be at least 3 characters',
        check: ({ username }) => username.trim().length < 3,
    },
    ...EMAIL_RULES<RegisterForm>(),
    {
        field: 'confirmPassword',
        message: 'Confirm password is required',
        check: ({ confirmPassword }) => !confirmPassword,
    },
    {
        field: 'confirmPassword',
        message: 'Passwords do not match',
        check: ({ password, confirmPassword }) => password !== confirmPassword,
    },
    ...PASSWORD_RULES<RegisterForm>(),
];
