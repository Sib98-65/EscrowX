import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">E</span>
                            </div>
                            <span className="text-lg font-bold text-white">EscrowX</span>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            The world's first fully decentralized freelancing marketplace.
                            Built on Polygon for speed, security, and zero fees.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/jobs" className="hover:text-primary transition-colors">Find Work</Link></li>
                            <li><Link href="/talent" className="hover:text-primary transition-colors">Hire Talent</Link></li>
                            <li><Link href="/escrow" className="hover:text-primary transition-colors">Escrow System</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/docs" className="hover:text-primary transition-colors">Documentation</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
                            <li><Link href="/community" className="hover:text-primary transition-colors">Community</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
                    <p>© 2026 EscrowX. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/terms" className="hover:text-white">Terms</Link>
                        <Link href="/privacy" className="hover:text-white">Privacy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
