'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Wallet, Menu, X, LogOut, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const navItems = [
    { name: 'Find Work', href: '/jobs' },
    { name: 'Hire Talent', href: '/talent' },
    { name: 'How it Works', href: '/how-it-works' },
];

export function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleConnect = () => {
        connect({ connector: injected() });
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <span className="text-white font-bold text-lg">E</span>
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            EscrowX
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/jobs" className="text-sm font-medium hover:text-white transition-colors">
                            Find Work
                        </Link>
                        <Link href="/talent" className="text-sm font-medium hover:text-white transition-colors">
                            Hire Talent
                        </Link>
                        <Link href="/how-it-works" className="text-sm font-medium hover:text-white transition-colors">
                            How it Works
                        </Link>
                        <Link href="/messages" className="text-sm font-medium hover:text-white transition-colors relative group">
                            <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background"></span>
                        </Link>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {mounted && isConnected ? (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-sm font-medium text-muted-foreground mr-2">
                                    {address?.slice(0, 6)}...{address?.slice(-4)}
                                </span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => disconnect()}
                                    className="h-auto p-1 text-muted-foreground hover:text-destructive"
                                >
                                    Disconnect
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className="rounded-full px-6 bg-white/10 hover:bg-white/20 text-white border-white/5 backdrop-blur-md"
                                onClick={handleConnect}
                            >
                                Connect Wallet
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden glass border-b border-white/10 p-4"
                >
                    <div className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-muted-foreground hover:text-primary"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                            {mounted && isConnected ? (
                                <Button variant="outline" size="sm" className="w-full" onClick={() => disconnect()}>
                                    Disconnect
                                </Button>
                            ) : (
                                <Button size="sm" className="w-full gap-2" onClick={handleConnect}>
                                    <Wallet className="w-4 h-4" />
                                    Connect Wallet
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
