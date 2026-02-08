'use client';

import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, DollarSign, Globe, Lock, Code } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent/10 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Hero Section */}
        <section className="min-h-[80vh] flex flex-col justify-center items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-semibold text-primary-foreground tracking-wide uppercase">Live on Polygon Mainnet</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight mb-6"
          >
            Work without <br />
            <span className="text-gradient">middlemen holding you back.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The first fully decentralized freelancing marketplace.
            <span className="text-foreground font-medium"> 0% platform fees.</span>
            <span className="text-foreground font-medium"> On-chain escrow.</span>
            <span className="text-foreground font-medium"> Trust in code.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/jobs">
              <Button size="lg" className="rounded-full px-8 text-lg hover:shadow-primary/40 shadow-xl transition-all hover:scale-105 w-full sm:w-auto">
                Find Work Immediately
                <Rocket className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/talent">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-lg border-white/20 hover:bg-white/10 transition-all hover:scale-105 w-full sm:w-auto">
                Hire Top Talent
              </Button>
            </Link>
          </motion.div>
        </section>

        {/* Features Grid */}
        <section className="py-24 relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="w-8 h-8 text-green-400" />}
              title="Escrow Protected"
              description="Funds are locked in a smart contract until the work is approved. No scams, no rug pulls."
              delay={0.2}
            />
            <FeatureCard
              icon={<DollarSign className="w-8 h-8 text-yellow-400" />}
              title="0% Commission"
              description="Keep 100% of your earnings. We don't take a cut. The protocol is community-owned."
              delay={0.4}
            />
            <FeatureCard
              icon={<Code className="w-8 h-8 text-blue-400" />}
              title="Trust in Code"
              description="Rules are enforced by immutable smart contracts, not by corporate middlemen."
              delay={0.6}
            />
          </div>
        </section>

        {/* How It Works (Brief) */}
        <section className="py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500">
              Freelancing <br /> Reinvented.
            </h2>
            <p className="text-muted-foreground text-lg">
              Connect your wallet, create a service, and get paid in crypto instantly upon delivery.
              No sign-ups, no banks, no waiting.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Globe className="w-5 h-5" />
                </div>
                <span>Global access, no borders.</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                  <Lock className="w-5 h-5" />
                </div>
                <span>Wallet-based identity.</span>
              </li>
            </ul>
          </div>

          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-indigo-600/20 rounded-2xl blur-2xl transform rotate-3" />
            <div className="glass-card p-8 relative border border-white/10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
                  <div>
                    <div className="w-24 h-4 bg-gray-700 rounded animate-pulse mb-2" />
                    <div className="w-16 h-3 bg-gray-800 rounded animate-pulse" />
                  </div>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">
                  ESCROW LOCKED
                </div>
              </div>
              <div className="space-y-4 mb-6">
                <div className="h-4 bg-gray-700/50 rounded w-full" />
                <div className="h-4 bg-gray-700/50 rounded w-3/4" />
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="text-sm text-gray-400">Total Amount</div>
                <div className="text-xl font-bold text-white">1,500 USDC</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass-card p-8 hover:bg-white/10 transition-colors group cursor-pointer"
    >
      <div className="mb-6 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-inner border border-white/5">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
