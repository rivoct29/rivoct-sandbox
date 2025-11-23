import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";

export default function StatusPage() {
  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-mono text-4xl font-bold text-white mb-8">SYSTEM_STATUS</h1>
        
        <div className="space-y-6">
          <div className="border border-signal bg-signal/5 p-6 rounded">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-3 w-3 rounded-full bg-signal animate-pulse" />
              <h2 className="font-mono text-xl font-bold text-white">ALL_SYSTEMS_OPERATIONAL</h2>
            </div>
            <p className="text-white/60 text-sm">All services running normally</p>
          </div>

          <div className="space-y-4">
            <h3 className="font-mono text-lg font-bold text-white">COMPONENTS</h3>
            
            <div className="border border-white/10 bg-white/5 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-white">Voice OTP API</span>
                <span className="text-signal font-mono text-sm">OPERATIONAL</span>
              </div>
              <p className="text-white/40 text-sm">API Gateway & Routing Engine</p>
            </div>

            <div className="border border-white/10 bg-white/5 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-white">Carrier Network</span>
                <span className="text-signal font-mono text-sm">OPERATIONAL</span>
              </div>
              <p className="text-white/40 text-sm">Primary & Secondary Carriers</p>
            </div>

            <div className="border border-white/10 bg-white/5 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-white">Dashboard & Console</span>
                <span className="text-signal font-mono text-sm">OPERATIONAL</span>
              </div>
              <p className="text-white/40 text-sm">Web Interface & Analytics</p>
            </div>

            <div className="border border-white/10 bg-white/5 p-4 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-white">Authentication</span>
                <span className="text-signal font-mono text-sm">OPERATIONAL</span>
              </div>
              <p className="text-white/40 text-sm">User Auth & API Key Management</p>
            </div>
          </div>

          <div className="mt-8 text-center text-white/40 text-sm font-mono">
            <p>Last checked: {new Date().toLocaleString()}</p>
            <p className="mt-2">For incidents and maintenance updates, contact <a href="mailto:support@rivoct.com" className="text-signal hover:underline">support@rivoct.com</a></p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
