import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-mono text-4xl font-bold text-white mb-4">TERMS OF SERVICE</h1>
        <p className="text-white/40 mb-8 font-mono text-sm">Last Updated: November 21, 2025</p>
        
        <div className="space-y-8 text-white/70 leading-relaxed">
          <div className="border border-signal/20 bg-signal/5 p-6 rounded">
            <p className="text-white font-mono mb-2">
              Please read these Terms of Service carefully before using Rivoct's voice OTP verification services.
            </p>
          </div>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">1. ACCEPTANCE OF TERMS</h2>
            <p>
              By accessing and using Rivoct's voice OTP verification services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">2. SERVICE DESCRIPTION</h2>
            <p>
              Rivoct provides enterprise-grade voice OTP routing and verification infrastructure. Service availability, features, and pricing are subject to your subscription plan.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">3. API USAGE</h2>
            <p>
              You are responsible for maintaining the confidentiality of your API keys. Rate limits and usage quotas apply based on your plan tier.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">4. DATA PRIVACY</h2>
            <p>
              We process phone numbers and verification data in accordance with our Privacy Policy and applicable data protection regulations.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">5. SERVICE LEVEL AGREEMENT</h2>
            <p>
              Enterprise plans include SLA guarantees. Specific uptime commitments and remedies are detailed in your service agreement.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">6. LIMITATION OF LIABILITY</h2>
            <p>
              Rivoct provides services "as is" without warranties. Our liability is limited to the amount paid for services in the preceding 12 months.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">7. CONTACT</h2>
            <p>
              For questions about these terms, contact us at <a href="mailto:legal@rivoct.com" className="text-signal hover:underline">legal@rivoct.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
