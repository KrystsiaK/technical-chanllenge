'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload } from 'lucide-react';

interface AvatarUploaderProps {
    value?: string;
    onChange: (base64: string) => void;
}

export function AvatarUploader({ value, onChange }: AvatarUploaderProps) {
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setPreview(base64);
            onChange(base64);
        };
        reader.readAsDataURL(file);
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <div
                className="relative w-20 h-20 rounded-full border overflow-hidden group cursor-pointer"
                onClick={handleClick}
            >
                {preview ? (
                    <Image
                        src={preview}
                        alt="Avatar"
                        fill
                        className="object-cover rounded-full transition-transform group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground bg-muted">
                        No Avatar
                    </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Upload className="h-5 w-5 text-white" />
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
}