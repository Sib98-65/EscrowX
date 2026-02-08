'use client';

import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MoreVertical, Phone, Video, Paperclip, CheckCheck, Clock, ShieldCheck } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { parseEther } from 'viem';
import { escrowXContractConfig } from '@/lib/contract';
import { Label } from '@/components/ui/Label';

// Mock Interfaces
interface Message {
    id: string;
    sender: 'me' | 'them';
    content: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
}

interface ContractTerms {
    price: string;
    deliveryTime: string;
    description: string;
}

export default function ChatPage() {
    const { isConnected } = useAccount();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', sender: 'them', content: "Hi! I saw your Smart Contract Audit service. Would you be available next week?", timestamp: new Date(Date.now() - 3600000), status: 'read' },
        { id: '2', sender: 'me', content: "Hello! Yes, absolutely. I can slot you in for Monday. What's the scope of the project?", timestamp: new Date(Date.now() - 3500000), status: 'read' },
        { id: '3', sender: 'them', content: "It's a yield farming protocol on Polygon. About 500 lines of Solidity.", timestamp: new Date(Date.now() - 3400000), status: 'read' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [contractTerms, setContractTerms] = useState<ContractTerms>({
        price: '0.5',
        deliveryTime: '7',
        description: 'Smart Contract Audit for Yield Farm Protocol'
    });
    const [showContractModal, setShowContractModal] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Wagmi Hooks for Contract Creation
    const {
        writeContract,
        data: hash,
        isPending: isWritePending,
        error: writeError
    } = useWriteContract();

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim()) return;

        const msg: Message = {
            id: Date.now().toString(),
            sender: 'me',
            content: newMessage,
            timestamp: new Date(),
            status: 'sent'
        };

        setMessages([...messages, msg]);
        setNewMessage('');

        // Simulate Reply
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                sender: 'them',
                content: "That sounds reasonable. Can we adjust the price to 0.45 ETH?",
                timestamp: new Date(),
                status: 'delivered'
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    const handleCreateContract = () => {
        // Here we would create the service on-chain first in a real app, OR create the escrow directly for a custom job.
        // For simplicity, let's assume this creates a custom service ID #999 and creates an escrow for it.
        if (!isConnected) {
            alert("Please connect wallet first.");
            return;
        }

        writeContract({
            ...escrowXContractConfig,
            functionName: 'createEscrow', // In reality, this might be a 'createCustomEscrow' function
            args: [BigInt(999)], // Mock Service ID
            value: parseEther(contractTerms.price),
        });
        setShowContractModal(false);
    };

    return (
        <div className="min-h-screen flex flex-col relative h-screen overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[500px] bg-primary/5 blur-[100px] pointer-events-none" />

            <Navbar />

            <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full h-[calc(100vh-80px)] pb-4 flex gap-6 relative z-10">
                {/* Sidebar - Contacts */}
                <div className="w-80 hidden md:flex flex-col gap-4">
                    <Card className="flex-1 flex flex-col p-4 overflow-hidden h-full border-white/5 bg-black/40">
                        <div className="mb-4">
                            <Input placeholder="Search messages..." className="bg-white/5 border-white/10" />
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors flex gap-3 ${i === 1 ? 'bg-white/10 border border-white/5' : ''}`}>
                                    <div className="relative">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                            {i === 1 ? 'JD' : i === 2 ? 'AK' : 'MS'}
                                        </div>
                                        {i === 1 && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-semibold text-sm truncate">John Doe</h4>
                                            <span className="text-xs text-muted-foreground">12:30 PM</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {i === 1 ? "That sounds reasonable. Can we..." : "Thanks for the delivery!"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Chat Header */}
                    <Card className="p-4 mb-4 flex justify-between items-center border-white/5 bg-black/40 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                JD
                            </div>
                            <div>
                                <h3 className="font-bold flex items-center gap-2">
                                    John Doe
                                    <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Verified Freelancer
                                    </span>
                                </h3>
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    Online | Local Time: 2:30 PM
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="hidden sm:flex">
                                <Phone className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="hidden sm:flex">
                                <Video className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setShowContractModal(true)} className="gap-2 border-primary/20 hover:bg-primary/10 text-primary">
                                <ShieldCheck className="w-4 h-4" />
                                Create Offer
                            </Button>
                            <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </div>
                    </Card>

                    {/* Messages List */}
                    <Card className="flex-1 mb-4 p-0 overflow-hidden border-white/5 bg-black/40 flex flex-col relative">
                        <div className="absolute inset-0 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'me' ? 'bg-primary text-white rounded-tr-sm' : 'bg-white/10 text-firefox rounded-tl-sm'}`}>
                                        <p className="text-sm leading-relaxed">{msg.content}</p>
                                        <div className={`flex items-center gap-1 mt-1 text-[10px] ${msg.sender === 'me' ? 'text-white/70 justify-end' : 'text-muted-foreground'}`}>
                                            {format(msg.timestamp, 'HH:mm')}
                                            {msg.sender === 'me' && (
                                                <span>
                                                    {msg.status === 'read' ? <CheckCheck className="w-3 h-3" /> : <CheckCheck className="w-3 h-3 opacity-50" />}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </Card>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
                        <Card className="flex-1 p-2 flex items-center gap-2 border-white/5 bg-black/40 rounded-xl">
                            <Button type="button" variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                                <Paperclip className="w-4 h-4" />
                            </Button>
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10"
                            />
                        </Card>
                        <Button type="submit" size="md" className="h-14 w-14 rounded-xl flex items-center justify-center p-0">
                            <Send className="w-5 h-5 ml-1" />
                        </Button>
                    </form>
                </div>
            </main>

            {/* Create Contract Modal */}
            <AnimatePresence>
                {showContractModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-lg"
                        >
                            <Card className="p-6 border-primary/20 shadow-2xl bg-[#0a0a0a]">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                        Create Escrow Contract
                                    </h2>
                                    <Button variant="ghost" size="sm" onClick={() => setShowContractModal(false)}>Close</Button>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="space-y-2">
                                        <Label>Project Description</Label>
                                        <Textarea
                                            value={contractTerms.description}
                                            onChange={(e) => setContractTerms({ ...contractTerms, description: e.target.value })}
                                            className="bg-white/5"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Price (ETH/MATIC)</Label>
                                            <Input
                                                value={contractTerms.price}
                                                onChange={(e) => setContractTerms({ ...contractTerms, price: e.target.value })}
                                                className="bg-white/5"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Delivery (Days)</Label>
                                            <Input
                                                value={contractTerms.deliveryTime}
                                                onChange={(e) => setContractTerms({ ...contractTerms, deliveryTime: e.target.value })}
                                                className="bg-white/5"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {writeError && (
                                    <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm rounded-lg text-center">
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

                                {isConfirming && (
                                    <div className="mb-4 p-3 bg-blue-500/10 text-blue-500 text-sm rounded-lg flex items-center gap-2">
                                        <Clock className="w-4 h-4 animate-spin" />
                                        Confirming transaction on blockchain...
                                    </div>
                                )}

                                {isConfirmed && (
                                    <div className="mb-4 p-3 bg-green-500/10 text-green-500 text-sm rounded-lg flex items-center gap-2">
                                        <CheckCheck className="w-4 h-4" />
                                        Contract Deployed & Funds Locked!
                                    </div>
                                )}

                                <div className="flex gap-3">
                                    <Button variant="outline" className="flex-1" onClick={() => setShowContractModal(false)}>Cancel</Button>
                                    <Button className="flex-1" onClick={handleCreateContract} disabled={isConfirming || isConfirmed}>
                                        {isConfirming ? 'Creating...' : isConfirmed ? 'Success' : 'Lock Funds in Escrow'}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground text-center mt-4">
                                    Funds will be held in the smart contract until you approve the delivery.
                                </p>
                            </Card>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
