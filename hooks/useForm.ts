import { useState, useCallback, FocusEvent, ChangeEvent, useMemo } from 'react';
import type { ErrorMap } from '@/lib/validate';
import { validate } from '@/lib/validate';
import type { Rule } from '@/lib/validate';

export const useForm = <T extends Record<string, any>>(initialValues: T, rules?: Rule<T>[]) => {
    const [values, setValues] = useState<T>(initialValues);
    const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

    const errors: ErrorMap<T> | null = useMemo(() => {
        if (!rules) return null;
        return validate(values, rules);
    }, [values, rules]);

    const isValid = !errors || Object.keys(errors).length === 0;

    const handleChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;
            setValues(prev => ({ ...prev, [name]: value }));
        },
        []
    );

    const handleBlur = useCallback((event: FocusEvent<HTMLInputElement>) => {
        const { name } = event.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    }, []);

    const validateForm = useCallback(() => errors, [errors]);
    const resetForm = useCallback(() => {
        setValues(initialValues);
        setTouched({} as Record<keyof T, boolean>);
    }, [initialValues]);


    return {
        values,
        setValues,
        handleChange,
        handleBlur,
        touched,
        errors,
        validateForm,
        resetForm,
        isValid,
    };
}