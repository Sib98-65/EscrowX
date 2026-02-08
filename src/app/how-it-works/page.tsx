'use client';

import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { ShieldCheck, Wallet, Lock, Sparkles, CheckCircle2, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HowItWorksPage() {
    const steps = [
        {
            icon: <Wallet className="w-8 h-8 text-purple-400" />,
            title: "1. Connect Your Wallet",
            description: "Log in with MetaMask or any Web3 wallet. No email, no password, no centralized server holding your data. Your wallet is your identity."
        },
        {
            icon: <UserCheck className="w-8 h-8 text-blue-400" />,
            title: "2. Find or Post a Service",
            description: "Freelancers list their skills. Clients browse the marketplace. Agreement on price and delivery time happens peer-to-peer."
        },
        {
            icon: <Lock className="w-8 h-8 text-yellow-400" />,
            title: "3. Lock Funds in Escrow",
            description: "The client deposits the payment into the EscrowX smart contract. Funds are safe—neither the freelancer nor EscrowX can touch them yet."
        },
        {
            icon: <Sparkles className="w-8 h-8 text-pink-400" />,
            title: "4. Work & Delivery",
            description: "The freelancer completes the work and submits it. The client reviews the delivery within the agreed timeframe."
        },
        {
            icon: <CheckCircle2 className="w-8 h-8 text-green-400" />,
            title: "5. Funds Released",
            description: "Once the client approves the work, the smart contract instantly releases the funds to the freelancer's wallet. 0% platform fees."
        }
    ];

    return (
        <div className="min-h-screen flex flex-col relative">
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-primary/5 blur-[100px] pointer-events-none" />

            <Navbar />

            <main className="flex-1 py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">How <span className="text-gradient">EscrowX</span> Works</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        A trustless, decentralized workflow designed to protect both clients and freelancers.
                    </p>
                </motion.div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent -translate-x-1/2" />

                    <div className="space-y-12 relative">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                            >
                                <div className="flex-1 w-full">
                                    <Card className={`p-6 border-primary/10 relative hover:border-primary/30 transition-colors group ${index % 2 === 0 ? 'text-left md:text-left' : 'text-left md:text-right'}`}>
                                        <div className={`flex items-center gap-4 mb-4 ${index % 2 === 0 ? 'flex-row' : 'flex-row md:flex-row-reverse'}`}>
                                            <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:scale-110 transition-transform duration-300">
                                                {step.icon}
                                            </div>
                                            <h3 className="text-xl font-bold">{step.title}</h3>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {step.description}
                                        </p>
                                    </Card>
                                </div>

                                {/* Timeline Dot */}
                                <div className="md:absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-background border-2 border-primary rounded-full z-10 shadow-[0_0_10px_rgba(124,58,237,0.5)]" />

                                <div className="flex-1 hidden md:block" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20 text-center bg-white/5 border border-white/10 rounded-2xl p-12 backdrop-blur-sm"
                >
                    <ShieldCheck className="w-12 h-12 text-green-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
                    <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                        Join the future of work. No sign-ups, no fees, just pure peer-to-peer collaboration.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/jobs">
                            <Button size="lg" className="px-8">Find Work</Button>
                        </Link>
                        <Link href="/talent">
                            <Button variant="outline" size="lg" className="px-8">Hire Talent</Button>
                        </Link>
                    </div>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
}
