import Link from "next/link";
import { LandingNav } from "../components/LandingNav";
import { Footer } from "../components/Footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-void text-primary selection:bg-signal selection:text-white">
      <LandingNav />
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />
      </div>

      {/* Hero Section with Radial Gradient */}
      <section className="relative z-10 pt-28 xs:pt-32 pb-16 sm:pb-20 lg:pt-48 lg:pb-32 px-4 xs:px-6">
        {/* Radial gradient behind hero (responsive sizes) */}
        <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] xs:w-[380px] sm:w-[600px] md:w-[700px] lg:w-[800px] h-[260px] xs:h-[380px] sm:h-[600px] md:h-[700px] lg:h-[800px] bg-signal/5 rounded-full blur-[120px]" />
        </div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div className="animate-fadeIn">
              <div 
                className="inline-flex items-center gap-2 rounded-full border border-signal/20 bg-signal/5 px-3 py-1.5 mb-6 sm:mb-8"
                aria-label="System operational"
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-signal"></span>
                </span>
                <span className="font-mono text-xs font-medium text-signal tracking-wider">All Systems Operational</span>
              </div>
              
              <h1 data-testid="hero-heading" style={{ fontWeight: 700 }} className="font-mono text-4xl xs:text-5xl tracking-hero text-white sm:text-6xl lg:text-7xl mb-5 sm:mb-6 leading-[1.05]">
                ENTERPRISE<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/40">
                  ROUTING ENGINE
                </span>
              </h1>
              
              <p className="text-base sm:text-lg text-white/70 max-w-xl mb-8 sm:mb-10 font-light leading-relaxed">
                Enterprise-grade voice verification routing infrastructure for global organizations.
                Multi-carrier redundancy with intelligent failover across 180+ countries.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link
                  href="/packages"
                  className="group relative inline-flex sm:inline-flex w-full sm:w-auto items-center justify-center overflow-hidden btn-standard font-mono text-sm font-bold text-white transition-colors duration-200 bg-signal hover:bg-signal/90 hover:shadow-lg hover:shadow-signal/30 touch-target"
                  style={{ borderRadius: 'var(--button-radius)' }}
                >
                  <span className="mr-2">View Pricing</span>
                  <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
                <Link
                  href="/features"
                  className="inline-flex w-full sm:w-auto items-center justify-center explore-features-btn font-mono text-sm font-bold text-white transition-colors duration-200 touch-target"
                  style={{ padding: '12px 24px', borderRadius: 'var(--button-radius)' }}
                  data-testid="explore-features-btn"
                >
                  Explore Features
                </Link>
              </div>
            </div>

            {/* Terminal Visual */}
            {/* Terminal visual hidden on very small screens to reduce clutter */}
            <div className="relative animate-fadeIn mt-8 lg:mt-0 hidden xs:block" style={{ animationDelay: '0.2s', animationFillMode: 'backwards' }}>
              <div className="absolute -inset-1 bg-gradient-to-r from-signal to-purple-600 rounded-lg blur opacity-20" aria-hidden="true" />
              <div 
                className="relative rounded-lg bg-[#0D0D0D] backdrop-blur-xl p-3 sm:p-4 font-mono text-[11px] xs:text-xs sm:text-sm overflow-x-auto terminal-example"
                role="region"
                aria-label="Terminal code example"
                data-testid="terminal-example"
              >
                <div className="flex items-center gap-2 mb-3 sm:mb-4 border-b border-white/5 pb-2 sm:pb-3 min-w-max">
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500/20 border border-red-500/50" aria-hidden="true" />
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" aria-hidden="true" />
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500/20 border border-green-500/50" aria-hidden="true" />
                  <div className="ml-auto text-white/30 text-[9px] sm:text-[10px]">bash — 80x24</div>
                </div>
                <div className="space-y-1.5 sm:space-y-2 text-white/80 leading-relaxed min-w-max text-sm sm:text-base" role="code">
                  <div className="flex items-start">
                    <span className="text-signal mr-2 flex-shrink-0">$</span>
                    <span className="flex-1 break-all">curl -X POST https://api.rivoct.com/v1/otp \</span>
                  </div>
                  <div className="pl-3 sm:pl-4 text-[#C4C4C4] break-all">
                    -H "Authorization: Bearer sk_live_..." \
                  </div>
                  <div className="pl-3 sm:pl-4 text-[#C4C4C4] break-all">
                    -d '&#123;"phone": "+919876543210"&#125;'
                  </div>
                  <div className="mt-3 sm:mt-4 text-green-400 leading-relaxed">
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
        <div className="mx-auto max-w-7xl px-4 xs:px-6 py-12 sm:py-16">
          <div className="stats-grid">
            {[
              { label: "Uptime SLA", value: "99.99%" },
              { label: "Avg Latency", value: "< 50ms" },
              { label: "Daily Requests", value: "10M+" },
              { label: "Carrier Routes", value: "12" },
            ].map((stat, index) => (
              <div 
                key={stat.label} 
                className="text-center md:text-left animate-fadeIn"
                role="group"
                aria-label={`${stat.label}: ${stat.value}`}
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
              >
                <div className="text-2xl xs:text-3xl md:text-4xl font-bold font-mono text-white mb-1.5 sm:mb-2">{stat.value}</div>
                <div className="stat-label text-white/50 tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-16 sm:py-20 lg:py-24 px-4 xs:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 sm:mb-16">
            <h2 className="font-mono text-2xl xs:text-3xl font-bold text-white mb-3 sm:mb-4">Core Capabilities</h2>
            <div className="h-1 w-16 sm:w-20 bg-signal" />
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                title: "Intelligent Routing",
                desc: "Dynamic route selection based on real-time delivery rates and carrier latency metrics.",
                icon: "🎯"
              },
              {
                title: "Flash Call Fallback",
                desc: "Automatic fallback to Flash Call or SMS if Voice OTP delivery fails within defined thresholds.",
                icon: "⚡"
              },
              {
                title: "Fraud Detection",
                desc: "Real-time analysis of number patterns and velocity to block fraudulent OTP requests.",
                icon: "🛡️"
              },
              {
                title: "Global Infrastructure",
                desc: "Distributed edge nodes ensure lowest possible latency regardless of user location.",
                icon: "🌍"
              },
              {
                title: "Compliance Ready",
                desc: "Fully compliant with TRAI DLT regulations and global data privacy standards.",
                icon: "✅"
              },
              {
                title: "Real-time Analytics",
                desc: "Granular visibility into delivery rates, latency, and costs via our dashboard.",
                icon: "📊"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group p-6 rounded-lg border border-white/5 bg-white/[0.02] transition-colors duration-200 animate-staggerFadeIn min-h-[180px] sm:min-h-[220px] flex flex-col"
                style={{ animationDelay: `${i * 0.08}s`, animationFillMode: 'backwards' }}
              >
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded bg-signal/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-signal/20 transition-colors duration-200 text-lg sm:text-xl icon-fill" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="font-mono text-base sm:text-lg font-bold text-white mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed flex-1">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-16 sm:py-20 lg:py-24 px-4 xs:px-6 border-t border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-mono text-3xl xs:text-4xl md:text-5xl font-bold text-white mb-5 sm:mb-6">
            Ready to Scale?
          </h2>
          <p className="text-base sm:text-lg text-white/70 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
            Join enterprises across finance, healthcare, e-commerce, and logistics using Rivoct for mission-critical verification.
          </p>
          <Link
            href="/packages"
            className="inline-flex items-center justify-center btn-standard bg-signal font-mono text-sm font-bold text-white transition-all duration-200 hover:bg-signal/90 hover:shadow-lg hover:shadow-signal/30 hover:-translate-y-1 touch-target"
            style={{ borderRadius: 'var(--button-radius)' }}
          >
            Choose Your Plan
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
