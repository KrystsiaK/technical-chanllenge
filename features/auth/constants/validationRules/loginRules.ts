import type { Rule } from '@/lib/validate';
import type { LoginForm } from '@/features/auth/interfaces/forms';
import { EMAIL_RULES } from '@/features/auth/constants/validationRules/emailRules';
import { PASSWORD_RULES } from '@/features/auth/constants/validationRules/passwordRules';

export const LOGIN_RULES: Rule<LoginForm>[] = [
    ...EMAIL_RULES<LoginForm>(),
    ...PASSWORD_RULES<LoginForm>(),
];
