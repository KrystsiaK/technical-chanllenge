'use client';

import { useAuth } from "@/features/auth/hooks/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/features/theme/components/ModeToggle";
import { Logo } from "@/components/ui/logo";

export const Header = () => {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const pathname = usePathname();

    if (isLoading) {
        return (
            <header className="border-b bg-background/80 backdrop-blur-md h-14 flex items-center justify-center">
                <div className="text-xs text-muted-foreground">Loading…</div>
            </header>
        );
    }

    return (
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-screen-xl items-center justify-between px-4 sm:px-6">
                <Logo href="/" />

                <nav className="hidden md:flex items-center gap-6">
                    <Link
                        href="/main"
                        className={`text-sm font-medium transition-colors ${pathname === '/main'
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Home
                    </Link>

                    {isAuthenticated && (
                        <Link
                            href="/dashboard"
                            className={`text-sm font-medium transition-colors ${pathname === '/dashboard'
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            Dashboard
                        </Link>
                    )}
                </nav>

                <div className="flex items-center gap-3">
                    <ModeToggle />

                    {isAuthenticated ? (
                        <>
                            <span className="hidden sm:block text-sm text-muted-foreground">
                                Hi, <span className="font-medium">{user?.username || "User"}</span>
                            </span>

                            <Button variant="outline" size="sm" className="cursor-pointer" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/auth" className="text-sm text-muted-foreground hover:text-foreground">
                            Login
                        </Link>
                    )}

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-64 p-4">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                            </SheetHeader>
                            <div className="mt-4 flex flex-col gap-4">
                                <Link href="/main">Home</Link>
                                {isAuthenticated && <Link href="/dashboard">Dashboard</Link>}
                                {isAuthenticated ? (
                                    <Button variant="outline" size="sm" className="cursor-pointer" onClick={logout}>
                                        Logout
                                    </Button>
                                ) : (
                                    <Link href="/auth">Login</Link>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
};