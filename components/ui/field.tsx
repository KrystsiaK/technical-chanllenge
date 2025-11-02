'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface FieldProps {
    label: string;
    name: string;
    value: string;
    type?: string;
    placeholder?: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onBlur?: React.FocusEventHandler<HTMLInputElement>;
    errors?: string[] | null;
}

export const Field = ({
    label,
    name,
    value,
    type = 'text',
    placeholder,
    onChange,
    onBlur,
    errors,
}: FieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <div className="space-y-1.5">
            <label
                htmlFor={name}
                className="block text-sm font-medium leading-none"
            >
                {label}
            </label>

            <div className="relative">
                <Input
                    id={name}
                    name={name}
                    type={inputType}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
                    className={isPassword ? 'pr-10' : ''}
                />

                {isPassword && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>

            {errors && (
                <ul className="mt-1 text-xs text-destructive">
                    {errors.map((msg) => (
                        <li key={msg}>{msg}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}