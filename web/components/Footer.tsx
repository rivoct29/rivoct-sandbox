import Link from "next/link";

export const Footer = () => {
  return (
    <footer 
      role="contentinfo"
      className="border-t border-white/10 footer-bg-dynamic pt-16 pb-8"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
              <span className="font-mono text-lg font-bold tracking-widest text-white">
                RIVOCT<span className="text-white/40">//</span>ENGINE
              </span>
            </div>
            <p className="max-w-xs text-sm footer-text-dynamic font-mono leading-relaxed">
              Enterprise voice verification infrastructure serving global organizations across finance, healthcare, e-commerce, and logistics.
            </p>
          </div>
          
          <div>
            <h3 className="font-mono text-xs font-bold text-white mb-4 uppercase tracking-wider">Platform</h3>
            <ul className="space-y-3 text-sm font-mono">
              <li><Link href="/features" className="footer-link transition-colors duration-200 inline-block">Features</Link></li>
              <li><Link href="/docs#network" className="footer-link transition-colors duration-200 inline-block">Global Network</Link></li>
              <li><Link href="/docs#security" className="footer-link transition-colors duration-200 inline-block">Security</Link></li>
              <li><Link href="/status" className="footer-link transition-colors duration-200 inline-block">Status & SLA</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-bold text-white mb-4 uppercase tracking-wider">Developers</h3>
            <ul className="space-y-3 text-sm font-mono">
              <li><Link href="/docs" className="footer-link transition-colors duration-200 inline-block">Documentation</Link></li>
              <li><Link href="/docs#api" className="footer-link transition-colors duration-200 inline-block">API Reference</Link></li>
              <li><Link href="/status" className="footer-link transition-colors duration-200 inline-block">Status Page</Link></li>
              <li><Link href="/changelog" className="footer-link transition-colors duration-200 inline-block">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-bold text-white mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3 text-sm font-mono">
              <li><Link href="/about" className="footer-link transition-colors duration-200 inline-block">About</Link></li>
              <li><Link href="/careers" className="footer-link transition-colors duration-200 inline-block">Careers</Link></li>
              <li><Link href="/contact" className="footer-link transition-colors duration-200 inline-block">Contact</Link></li>
              <li><Link href="/legal" className="footer-link transition-colors duration-200 inline-block">Legal</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs footer-text-dynamic font-mono">
            © 2025 Rivoct Technologies. All systems nominal.
          </p>
          <nav 
            aria-label="Legal links"
            className="flex gap-6 text-xs font-mono"
          >
            <Link href="/terms" className="footer-link transition-colors duration-200">Terms</Link>
            <Link href="/privacy" className="footer-link transition-colors duration-200">Privacy</Link>
            <Link href="/cookies" className="footer-link transition-colors duration-200">Cookies</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
