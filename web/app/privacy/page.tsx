import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-mono text-4xl font-bold text-white mb-4">PRIVACY POLICY</h1>
        <p className="text-white/40 mb-8 font-mono text-sm">Last Updated: November 21, 2025</p>
        
        <div className="space-y-8 text-white/70 leading-relaxed">
          <div className="border border-signal/20 bg-signal/5 p-6 rounded">
            <p className="text-white font-mono mb-2">
              At Rivoct, we are committed to protecting your privacy and ensuring transparency in how we collect, use, and protect your data.
            </p>
          </div>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">1. INFORMATION WE COLLECT</h2>
            <p>
              We collect phone numbers, verification timestamps, delivery status, and API usage metadata necessary to provide voice OTP services.
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Phone numbers (hashed for storage)</li>
              <li>OTP delivery timestamps and status</li>
              <li>API authentication tokens</li>
              <li>Usage metrics and billing data</li>
            </ul>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">2. HOW WE USE YOUR DATA</h2>
            <p>
              We use collected data solely to provide, maintain, and improve our voice OTP verification services.
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Deliver voice OTP to end users</li>
              <li>Monitor service performance and reliability</li>
              <li>Prevent fraud and abuse</li>
              <li>Generate usage reports and billing</li>
            </ul>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">3. DATA RETENTION</h2>
            <p>
              Phone numbers are retained for 90 days for operational purposes. OTP codes are never stored in plaintext and expire after use or timeout.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">4. DATA SECURITY</h2>
            <p>
              We implement industry-standard security measures including encryption at rest and in transit, access controls, and regular security audits.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">5. THIRD-PARTY SERVICES</h2>
            <p>
              We partner with telecom carriers to deliver voice OTP. These partners process phone numbers in accordance with their privacy policies and applicable regulations.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">6. YOUR RIGHTS</h2>
            <p>
              You have the right to access, correct, or delete your data. Contact us at <a href="mailto:privacy@rivoct.com" className="text-signal hover:underline">privacy@rivoct.com</a> to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">7. COMPLIANCE</h2>
            <p>
              Rivoct complies with applicable data protection regulations including GDPR, CCPA, and India's IT Act.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">8. CONTACT</h2>
            <p>
              For privacy inquiries, contact us at <a href="mailto:privacy@rivoct.com" className="text-signal hover:underline">privacy@rivoct.com</a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
