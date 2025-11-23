import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-mono text-4xl font-bold text-white mb-8">CHANGELOG</h1>
        
        <div className="space-y-8">
          <div className="border border-white/10 bg-white/5 p-6 rounded">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-mono text-xl font-bold text-white">v1.0.0</h2>
              <span className="text-signal font-mono text-sm">2025-11-21</span>
            </div>
            <div className="space-y-2 text-white/70">
              <p className="font-bold text-white">🚀 Initial Release</p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Voice OTP routing engine with intelligent carrier selection</li>
                <li>Real-time delivery tracking and analytics dashboard</li>
                <li>Automatic failover with secondary carrier support</li>
                <li>RESTful API with comprehensive documentation</li>
                <li>Webhook integration for delivery status callbacks</li>
                <li>Multi-tier pricing with sandbox environment</li>
                <li>Admin console for customer management</li>
              </ul>
            </div>
          </div>

          <div className="border border-white/10 bg-white/5 p-6 rounded">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-mono text-xl font-bold text-white">v0.9.0-beta</h2>
              <span className="text-white/40 font-mono text-sm">2025-11-15</span>
            </div>
            <div className="space-y-2 text-white/70">
              <p className="font-bold text-white">🔧 Pre-release Testing</p>
              <ul className="list-disc ml-6 space-y-1 text-sm">
                <li>Closed beta with select partners</li>
                <li>Performance optimization for high-volume scenarios</li>
                <li>Rate limiting and abuse prevention</li>
                <li>Enhanced error handling and retry logic</li>
              </ul>
            </div>
          </div>

          <div className="border border-white/10 bg-white/5 p-6 rounded">
            <h3 className="font-mono text-lg font-bold text-white mb-2">UPCOMING</h3>
            <ul className="list-disc ml-6 space-y-1 text-white/60 text-sm">
              <li>Multi-language voice OTP support</li>
              <li>Advanced analytics with custom date ranges</li>
              <li>Bulk API for batch OTP delivery</li>
              <li>SMS fallback integration</li>
              <li>White-label branding options</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
