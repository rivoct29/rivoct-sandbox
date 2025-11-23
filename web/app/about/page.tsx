import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-mono text-4xl font-bold text-white mb-8">ABOUT RIVOCT</h1>
        
        <div className="space-y-12 text-white/70 leading-relaxed">
          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">MISSION</h2>
            <p className="text-lg">
              Rivoct delivers enterprise-grade voice OTP verification infrastructure for organizations that demand reliability, speed, and scale.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">WHAT WE DO</h2>
            <p>
              We provide deterministic voice OTP routing with intelligent carrier selection, real-time failover, and comprehensive delivery analytics.
            </p>
            <p className="mt-4">
              Built on serverless infrastructure, Rivoct handles millions of verification requests with predictable latency and industry-leading success rates.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">INDUSTRIES WE SERVE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="border border-white/10 bg-white/5 p-4 rounded">
                <h3 className="font-mono font-bold text-white mb-2">🏦 FINANCE & BANKING</h3>
                <p className="text-sm">Secure transaction verification and account authentication</p>
              </div>
              <div className="border border-white/10 bg-white/5 p-4 rounded">
                <h3 className="font-mono font-bold text-white mb-2">🏥 HEALTHCARE</h3>
                <p className="text-sm">Patient identity verification and appointment confirmations</p>
              </div>
              <div className="border border-white/10 bg-white/5 p-4 rounded">
                <h3 className="font-mono font-bold text-white mb-2">🛒 E-COMMERCE</h3>
                <p className="text-sm">Order confirmations and account security</p>
              </div>
              <div className="border border-white/10 bg-white/5 p-4 rounded">
                <h3 className="font-mono font-bold text-white mb-2">📦 LOGISTICS</h3>
                <p className="text-sm">Delivery verification and shipment tracking</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">TECHNOLOGY</h2>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-signal">→</span>
                <span><strong className="text-white">Intelligent Routing:</strong> Dynamic carrier selection based on real-time performance metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-signal">→</span>
                <span><strong className="text-white">Automatic Failover:</strong> Seamless retry logic with secondary carrier fallback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-signal">→</span>
                <span><strong className="text-white">Real-time Analytics:</strong> Comprehensive delivery tracking and performance dashboards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-signal">→</span>
                <span><strong className="text-white">Serverless Architecture:</strong> Infinite scale with predictable costs</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">COVERAGE</h2>
            <p>
              Currently serving organizations across India with plans for global expansion. Our multi-carrier network ensures optimal delivery rates across all major telecom providers.
            </p>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">CONTACT US</h2>
            <div className="space-y-2 font-mono text-sm">
              <p>For partnerships: <a href="mailto:partnerships@rivoct.com" className="text-signal hover:underline">partnerships@rivoct.com</a></p>
              <p>For support: <a href="mailto:support@rivoct.com" className="text-signal hover:underline">support@rivoct.com</a></p>
              <p>For general inquiries: <a href="mailto:admin@rivoct.com" className="text-signal hover:underline">admin@rivoct.com</a></p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
