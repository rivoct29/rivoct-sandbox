import Link from "next/link";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-void text-primary">
      <Nav />
      
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-16">
          <h1 className="font-mono text-4xl font-bold text-white mb-4">Contact Us</h1>
          <div className="h-1 w-20 bg-signal" />
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h2 className="font-mono text-xl font-bold text-white mb-4">Enterprise Inquiries</h2>
              <p className="text-white/60 leading-relaxed mb-6">
                For custom solutions, volume discounts, and dedicated infrastructure, contact our enterprise team.
              </p>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex items-start gap-3">
                  <span className="text-signal">📧</span>
                  <div>
                    <div className="text-white/40">Email</div>
                    <a href="mailto:enterprise@rivoct.com" className="text-white hover:text-signal transition-colors">
                      enterprise@rivoct.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-mono text-xl font-bold text-white mb-4">Technical Support</h2>
              <p className="text-white/60 leading-relaxed mb-6">
                For API integration help, billing questions, and technical troubleshooting.
              </p>
              <div className="space-y-3 text-sm font-mono">
                <div className="flex items-start gap-3">
                  <span className="text-signal">💬</span>
                  <div>
                    <div className="text-white/40">Email</div>
                    <a href="mailto:tech@rivoct.com" className="text-white hover:text-signal transition-colors">
                      tech@rivoct.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-signal">📚</span>
                  <div>
                    <div className="text-white/40">Documentation</div>
                    <Link href="/docs" className="text-white hover:text-signal transition-colors">
                      View integration guides
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-8 rounded-lg">
            <h3 className="font-mono font-bold text-white mb-6">Quick Inquiry</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold text-white mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/30 focus:border-signal focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-white mb-2">Email</label>
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/30 focus:border-signal focus:outline-none transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-white mb-2">Company (Optional)</label>
                <input
                  type="text"
                  placeholder="Your company"
                  className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/30 focus:border-signal focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-mono font-bold text-white mb-2">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your use case..."
                  className="w-full rounded border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/30 focus:border-signal focus:outline-none resize-none transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded bg-signal text-white font-mono font-bold py-3 hover:bg-signal/90 transition-all duration-200 hover:shadow-lg hover:shadow-signal/30"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
