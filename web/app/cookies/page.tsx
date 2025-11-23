import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-mono text-4xl font-bold text-white mb-4">COOKIE POLICY</h1>
        <p className="text-white/40 mb-8 font-mono text-sm">Last Updated: November 21, 2025</p>
        
        <div className="space-y-8 text-white/70 leading-relaxed">
          <div className="border border-signal/20 bg-signal/5 p-6 rounded">
            <p className="text-white font-mono mb-2">
              This Cookie Policy explains how Rivoct uses cookies and similar technologies to enhance your experience.
            </p>
          </div>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">1. WHAT ARE COOKIES?</h2>
            <p>
              Cookies are small text files stored on your device when you visit websites. They help us provide a better user experience by remembering your preferences and session data.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">2. COOKIES WE USE</h2>
            <div className="space-y-4">
              <div className="border border-white/10 bg-white/5 p-4 rounded">
                <h3 className="font-mono font-bold text-white mb-2">Essential Cookies (Required)</h3>
                <p className="text-sm">Authentication tokens, session management, and security features. These cannot be disabled.</p>
              </div>
              
              <div className="border border-white/10 bg-white/5 p-4 rounded">
                <h3 className="font-mono font-bold text-white mb-2">Analytics Cookies (Optional)</h3>
                <p className="text-sm">Usage metrics to improve our service. Can be disabled in browser settings.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">3. THIRD-PARTY COOKIES</h2>
            <p>
              We use Firebase Authentication which may set its own cookies for authentication and security purposes.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">4. MANAGING COOKIES</h2>
            <p>
              You can control cookies through your browser settings. Note that disabling essential cookies may prevent access to authenticated areas of the site.
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1 text-sm">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-signal hover:underline" target="_blank" rel="noopener noreferrer">Chrome Cookie Settings</a></li>
              <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" className="text-signal hover:underline" target="_blank" rel="noopener noreferrer">Firefox Cookie Settings</a></li>
              <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-signal hover:underline" target="_blank" rel="noopener noreferrer">Safari Cookie Settings</a></li>
            </ul>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">5. UPDATES TO THIS POLICY</h2>
            <p>
              We may update this Cookie Policy periodically. Changes will be posted on this page with an updated revision date.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">6. CONTACT</h2>
            <p>
              For questions about cookies, contact us at <a href="mailto:privacy@rivoct.com" className="text-signal hover:underline">privacy@rivoct.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
