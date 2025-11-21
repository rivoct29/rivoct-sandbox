import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-void pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-signal" />
              <span className="font-mono text-lg font-bold tracking-widest text-white">
                RIVOCT<span className="text-white/40">//</span>ENGINE
              </span>
            </div>
            <p className="max-w-xs text-sm text-white/50 font-mono">
              Enterprise-grade voice OTP routing infrastructure for high-scale fintech applications.
            </p>
          </div>
          
          <div>
            <h3 className="font-mono text-xs font-bold text-white mb-4">PLATFORM</h3>
            <ul className="space-y-3 text-sm text-white/50 font-mono">
              <li><Link href="#" className="hover:text-signal transition-colors">Routing Engine</Link></li>
              <li><Link href="#" className="hover:text-signal transition-colors">Global Network</Link></li>
              <li><Link href="#" className="hover:text-signal transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-signal transition-colors">SLA & Uptime</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-bold text-white mb-4">DEVELOPERS</h3>
            <ul className="space-y-3 text-sm text-white/50 font-mono">
              <li><Link href="#" className="hover:text-signal transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-signal transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-signal transition-colors">Status Page</Link></li>
              <li><Link href="#" className="hover:text-signal transition-colors">Github</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-bold text-white mb-4">COMPANY</h3>
            <ul className="space-y-3 text-sm text-white/50 font-mono">
              <li><Link href="#" className="hover:text-signal transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-signal transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-signal transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-signal transition-colors">Legal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30 font-mono">
            © 2025 Rivoct Technologies. All systems nominal.
          </p>
          <div className="flex gap-6 text-xs text-white/30 font-mono">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
