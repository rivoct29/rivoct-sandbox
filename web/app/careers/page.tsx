import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <main className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-mono text-4xl font-bold text-white mb-4">CAREERS</h1>
        <p className="text-white/60 mb-12">Join us in building the future of voice verification</p>
        
        <div className="space-y-8">
          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">WHY RIVOCT?</h2>
            <div className="space-y-4 text-white/70">
              <p>
                We're a small, focused team solving critical infrastructure problems for enterprises across India and beyond.
              </p>
              <p>
                Our mission is to make voice OTP verification reliable, fast, and accessible at scale.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">OPEN POSITIONS</h2>
            <div className="border border-white/10 bg-white/5 p-8 rounded text-center">
              <p className="text-white/60 mb-4">No open positions at this time</p>
              <p className="text-white/40 text-sm">
                We're always interested in hearing from talented engineers, product designers, and growth specialists.
              </p>
            </div>
          </section>

          <section>
            <h2 className="font-mono text-2xl font-bold text-white mb-4">INTERESTED?</h2>
            <div className="space-y-4 text-white/70">
              <p>
                Even if we don't have an open role that matches your skills, we'd love to hear from you.
              </p>
              <p>
                Send your resume and a note about what you'd like to build to{" "}
                <a href="mailto:careers@rivoct.com" className="text-signal hover:underline">
                  careers@rivoct.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
