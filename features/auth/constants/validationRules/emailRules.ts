import type { Rule } from '@/lib/validate'

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EMAIL_RULES = <T extends { email: string }>(): Rule<T>[] => [
  {
    field: 'email',
    message: 'Email is required',
    check: ({ email }) => !email.trim(),
  },
  {
    field: 'email',
    message: 'Invalid email format',
    check: ({ email }) => !EMAIL_REGEX.test(email.trim()),
  },
];