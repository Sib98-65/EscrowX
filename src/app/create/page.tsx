'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import Link from 'next/link';
import { escrowXContractConfig } from '@/lib/contract';

const serviceSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.string().regex(/^\d+(\.\d{1,18})?$/, 'Invalid price format'),
    deliveryTime: z.string().min(1, 'Delivery time is required'),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

export default function CreateServicePage() {
    const { isConnected } = useAccount();
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        data: hash,
        writeContract,
        isPending: isWritePending,
        error: writeError
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
    });

    useEffect(() => {
        if (isConfirmed) {
            setIsSuccess(true);
            reset();
        }
    }, [isConfirmed, reset]);

    const onSubmit = async (data: ServiceFormValues) => {
        // Convert delivery time to seconds (simplified logic for hackathon)
        // Assume input is days for now
        const deliverySeconds = parseInt(data.deliveryTime) * 24 * 60 * 60 || 86400;

        writeContract({
            ...escrowXContractConfig,
            functionName: 'createService',
            args: [
                data.title,
                data.description, // In real app, upload to IPFS and store hash here
                parseEther(data.price),
                BigInt(deliverySeconds),
            ],
        });
    };

    const isSubmitting = isWritePending || isConfirming;

    // If not connected, show prompt
    if (!isConnected) {
        return (
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <Card className="max-w-md w-full text-center py-12">
                        <h2 className="text-2xl font-bold mb-4">Connect Wallet</h2>
                        <p className="text-muted-foreground mb-6">
                            You need to connect your wallet to post a service on the decentralized marketplace.
                        </p>
                        {/* The Navbar has the connect button, but we can't trigger it easily from here without global state. 
                For now, just guiding the user. 
            */}
                        <div className="p-4 bg-yellow-500/10 text-yellow-500 rounded-lg text-sm">
                            Please use the "Connect Wallet" button in the top right corner.
                        </div>
                    </Card>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Background */}
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-primary/5 blur-[100px] pointer-events-none" />

            <Navbar />

            <main className="flex-1 py-24 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto w-full relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold mb-2">Create a Service</h1>
                    <p className="text-muted-foreground">
                        List your skills on the decentralized marketplace.
                    </p>
                </motion.div>

                {isSuccess ? (
                    <Card className="text-center py-12">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Service Created Successfully!</h2>
                        <p className="text-muted-foreground mb-1">
                            Your service transaction has been confirmed on-chain.
                        </p>
                        {hash && (
                            <a
                                href={`https://polygonscan.com/tx/${hash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mb-8 block"
                            >
                                View Transaction
                            </a>
                        )}
                        <div className="flex justify-center gap-4">
                            <Link href="/jobs">
                                <Button>View Listing</Button>
                            </Link>
                            <Button variant="outline" onClick={() => setIsSuccess(false)}>Create Another</Button>
                        </div>
                    </Card>
                ) : (
                    <Card>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Service Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. I will build a decentralized app for you"
                                    {...register('title')}
                                />
                                {errors.title && (
                                    <p className="text-red-500 text-xs">{errors.title.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe your service in detail..."
                                    className="min-h-[150px]"
                                    {...register('description')}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-xs">{errors.description.message}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (MATIC)</Label>
                                    <div className="relative">
                                        <Input
                                            id="price"
                                            placeholder="0.00"
                                            className="pl-8"
                                            {...register('price')}
                                        />
                                        <span className="absolute left-3 top-3 text-muted-foreground font-bold">Ξ</span>
                                    </div>
                                    {errors.price && (
                                        <p className="text-red-500 text-xs">{errors.price.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="deliveryTime">Delivery Time (Days)</Label>
                                    <Input
                                        id="deliveryTime"
                                        placeholder="e.g. 3"
                                        type="number"
                                        {...register('deliveryTime')}
                                    />
                                    {errors.deliveryTime && (
                                        <p className="text-red-500 text-xs">{errors.deliveryTime.message}</p>
                                    )}
                                </div>
                            </div>

                            {writeError && (
                                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-yellow-500 text-sm text-center">
                                    {(() => {
                                        const msg = writeError.message?.toLowerCase() || '';
                                        if (msg.includes('user rejected') || msg.includes('user denied')) {
                                            return "Transaction incomplete due to user rejection.";
                                        }
                                        if (msg.includes('insufficient funds') || msg.includes('exceeds balance')) {
                                            return "Transaction incomplete due to insufficient funds.";
                                        }
                                        return "Transaction incomplete.";
                                    })()}
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full text-lg h-12 mt-4"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        {isConfirming ? 'Confirming...' : 'Check Wallet...'}
                                    </span>
                                ) : (
                                    'Publish Service'
                                )}
                            </Button>
                        </form>
                    </Card>
                )}
            </main>

            <Footer />
        </div>
    );
}
