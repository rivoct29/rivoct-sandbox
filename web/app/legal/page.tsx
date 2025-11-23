import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-mono text-4xl font-bold text-white mb-8">LEGAL</h1>
        
        <div className="space-y-6">
          <div className="border border-white/10 bg-white/5 p-6 rounded hover:bg-white/10 transition">
            <Link href="/terms" className="block">
              <h2 className="font-mono text-xl font-bold text-white mb-2">Terms of Service</h2>
              <p className="text-white/60 text-sm">Conditions for using Rivoct's services</p>
            </Link>
          </div>

          <div className="border border-white/10 bg-white/5 p-6 rounded hover:bg-white/10 transition">
            <Link href="/privacy" className="block">
              <h2 className="font-mono text-xl font-bold text-white mb-2">Privacy Policy</h2>
              <p className="text-white/60 text-sm">How we collect, use, and protect your data</p>
            </Link>
          </div>

          <div className="border border-white/10 bg-white/5 p-6 rounded hover:bg-white/10 transition">
            <Link href="/cookies" className="block">
              <h2 className="font-mono text-xl font-bold text-white mb-2">Cookie Policy</h2>
              <p className="text-white/60 text-sm">Information about cookies and tracking</p>
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm">
            For legal inquiries, contact{" "}
            <a href="mailto:legal@rivoct.com" className="text-signal hover:underline">
              legal@rivoct.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
