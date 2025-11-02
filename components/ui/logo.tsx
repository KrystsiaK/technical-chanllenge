"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface LogoProps {
    size?: number;
    href?: string;
}

export const Logo = ({ size = 120, href = "/" }: LogoProps) => {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const aspect = 172 / 721;
    const src = theme === "dark" ? "/logo-dark.webp" : "/logo-light.webp";

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const logo = (
        <div
            className="relative select-none"
            style={{
                width: `${size}px`,
                height: `${size * aspect}px`,
            }}
        >
            <Image
                src={src}
                alt="1GLOBAL Logo"
                fill
                priority
                sizes="100%"
                style={{ objectFit: "contain" }}
            />
        </div>
    );

    return href ? <Link href={href}>{logo}</Link> : logo;
};