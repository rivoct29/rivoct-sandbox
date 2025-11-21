import Link from "next/link";
import { LandingNav } from "../components/LandingNav";
import { Footer } from "../components/Footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-void text-primary selection:bg-signal selection:text-white">
      <LandingNav />
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-signal/20 bg-signal/5 px-3 py-1 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-signal"></span>
                </span>
                <span className="font-mono text-xs font-medium text-signal tracking-wider">SYSTEM OPERATIONAL</span>
              </div>
              
              <h1 className="font-mono text-5xl font-bold tracking-tighter text-white sm:text-7xl mb-6 leading-[1.1]">
                ENTERPRISE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">ROUTING ENGINE</span>
              </h1>
              
              <p className="text-lg text-white/60 max-w-xl mb-10 font-light leading-relaxed">
                Deterministic Voice OTP delivery for high-scale fintechs. 
                Zero-latency routing across premium Indian telecom providers with intelligent failover.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-sm bg-white px-8 py-4 font-mono text-sm font-bold text-black transition-all hover:bg-signal hover:text-white"
                >
                  <span className="mr-2">INITIALIZE_CONSOLE</span>
                  <span className="transition-transform group-hover:translate-x-1">-&gt;</span>
                </Link>
                <Link
                  href="#docs"
                  className="inline-flex items-center justify-center rounded-sm border border-white/10 px-8 py-4 font-mono text-sm font-bold text-white transition-all hover:bg-white/5 hover:border-white/20"
                >
                  READ_DOCUMENTATION
                </Link>
              </div>
            </div>

            {/* Terminal Visual */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-signal to-purple-600 rounded-lg blur opacity-20" />
              <div className="relative rounded-lg border border-white/10 bg-black/90 backdrop-blur-xl p-4 font-mono text-xs sm:text-sm shadow-2xl">
                <div className="flex items-center gap-2 mb-4 border-b border-white/5 pb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500/20 border border-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/20 border border-green-500/50" />
                  <div className="ml-auto text-white/30 text-[10px]">bash — 80x24</div>
                </div>
                <div className="space-y-2 text-white/80">
                  <div className="flex">
                    <span className="text-signal mr-2">$</span>
                    <span className="typing-effect">curl -X POST https://api.rivoct.com/v1/otp \</span>
                  </div>
                  <div className="pl-4 text-white/60">
                    -H "Authorization: Bearer sk_live_..." \
                  </div>
                  <div className="pl-4 text-white/60">
                    -d '&#123;"phone": "+919876543210"&#125;'
                  </div>
                  <div className="mt-4 text-green-400">
                    {`{`}
                    <br />
                    &nbsp;&nbsp;"status": "queued",
                    <br />
                    &nbsp;&nbsp;"id": "otp_8x92mn...",
                    <br />
                    &nbsp;&nbsp;"latency": "12ms"
                    <br />
                    {`}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "UPTIME SLA", value: "99.99%" },
              { label: "AVG LATENCY", value: "< 50ms" },
              { label: "DAILY REQUESTS", value: "10M+" },
              { label: "CARRIER ROUTES", value: "12" },
            ].map((stat) => (
              <div key={stat.label} className="text-center md:text-left">
                <div className="text-2xl md:text-4xl font-bold font-mono text-white mb-1">{stat.value}</div>
                <div className="text-xs font-mono text-white/40 tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16">
            <h2 className="font-mono text-3xl font-bold text-white mb-4">CORE CAPABILITIES</h2>
            <div className="h-1 w-20 bg-signal" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Intelligent Routing",
                desc: "Dynamic route selection based on real-time delivery rates and carrier latency metrics."
              },
              {
                title: "Flash Call Fallback",
                desc: "Automatic fallback to Flash Call or SMS if Voice OTP delivery fails within defined thresholds."
              },
              {
                title: "Fraud Detection",
                desc: "Real-time analysis of number patterns and velocity to block fraudulent OTP requests."
              },
              {
                title: "Global Infrastructure",
                desc: "Distributed edge nodes ensure lowest possible latency regardless of user location."
              },
              {
                title: "Compliance Ready",
                desc: "Fully compliant with TRAI DLT regulations and global data privacy standards."
              },
              {
                title: "Real-time Analytics",
                desc: "Granular visibility into delivery rates, latency, and costs via our dashboard."
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                <div className="h-10 w-10 rounded bg-signal/10 flex items-center justify-center mb-6 group-hover:bg-signal/20 transition-colors">
                  <div className="h-2 w-2 bg-signal rounded-full" />
                </div>
                <h3 className="font-mono text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-mono text-4xl md:text-5xl font-bold text-white mb-6">
            READY TO SCALE?
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-2xl mx-auto">
            Join the fastest growing fintechs in India using Rivoct for mission-critical authentication.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-sm bg-signal px-8 py-4 font-mono text-sm font-bold text-white transition-all hover:bg-signal/90 hover:scale-105"
          >
            START_INTEGRATION_NOW
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
