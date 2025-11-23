"use client";

import Link from "next/link";
import { LandingNav } from "../../components/LandingNav";
import { Footer } from "../../components/Footer";

export default function FeaturesPage() {
  return (
    <main className="relative min-h-screen bg-void text-primary selection:bg-signal selection:text-white">
      <LandingNav />
      
      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />
      </div>

      {/* Breadcrumbs */}
      <section className="relative z-10 pt-32 pb-8 px-6">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-mono text-white/50 mb-8">
            <Link href="/" className="hover:text-signal transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Features</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative z-10 pb-16 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-signal/20 bg-signal/5 px-3 py-1.5 mb-6">
            <span className="font-mono text-xs font-medium text-signal tracking-wider">Platform Capabilities</span>
          </div>
          
          <h1 className="font-mono text-5xl font-bold tracking-hero text-white mb-6">
            Enterprise-Grade Features
          </h1>
          
          <p className="text-lg text-white/70 max-w-3xl leading-relaxed">
            Built for mission-critical verification infrastructure. Every feature designed for scale, reliability, and global reach.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 pb-24 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Intelligent Routing",
                desc: "Dynamic route selection based on real-time delivery rates, carrier latency metrics, and historical performance data.",
                icon: "🎯",
                details: [
                  "Real-time carrier selection",
                  "Latency-based optimization",
                  "Automatic failover",
                  "Cost-aware routing"
                ]
              },
              {
                title: "Flash Call Fallback",
                desc: "Automatic fallback to Flash Call or SMS if Voice OTP delivery fails within defined thresholds.",
                icon: "⚡",
                details: [
                  "Instant Flash Call backup",
                  "SMS fallback option",
                  "Configurable thresholds",
                  "Zero user friction"
                ]
              },
              {
                title: "Fraud Detection",
                desc: "Real-time analysis of number patterns and velocity to block fraudulent OTP requests before they cost you money.",
                icon: "🛡️",
                details: [
                  "ML-based pattern detection",
                  "Velocity rate limiting",
                  "Geo-fencing rules",
                  "Customizable blocklists"
                ]
              },
              {
                title: "Global Infrastructure",
                desc: "Distributed edge nodes across multiple continents ensure lowest possible latency regardless of user location.",
                icon: "🌍",
                details: [
                  "180+ country coverage",
                  "Multi-region deployment",
                  "Edge node routing",
                  "< 50ms global latency"
                ]
              },
              {
                title: "Compliance Ready",
                desc: "Fully compliant with TRAI DLT regulations, GDPR, and global data privacy standards out of the box.",
                icon: "✅",
                details: [
                  "TRAI DLT compliant",
                  "GDPR compatible",
                  "SOC 2 Type II certified",
                  "ISO 27001 compliant"
                ]
              },
              {
                title: "Real-time Analytics",
                desc: "Granular visibility into delivery rates, latency, costs, and carrier performance via our dashboard.",
                icon: "📊",
                details: [
                  "Live delivery tracking",
                  "Cost breakdown reports",
                  "Carrier performance metrics",
                  "Custom data exports"
                ]
              },
              {
                title: "Webhook Callbacks",
                desc: "Real-time delivery status updates pushed to your servers. No polling required.",
                icon: "🔔",
                details: [
                  "Instant status updates",
                  "Retry mechanism",
                  "Signature verification",
                  "Custom headers support"
                ]
              },
              {
                title: "API-First Design",
                desc: "Clean, RESTful API with comprehensive documentation and SDKs for every major language.",
                icon: "⚙️",
                details: [
                  "RESTful endpoints",
                  "OpenAPI specification",
                  "Multi-language SDKs",
                  "Sandbox environment"
                ]
              },
              {
                title: "White-Label Options",
                desc: "Custom sender IDs, branded caller names, and white-label dashboard for enterprise customers.",
                icon: "🏷️",
                details: [
                  "Custom sender IDs",
                  "Branded caller names",
                  "White-label dashboard",
                  "Custom domain support"
                ]
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="group p-8 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,255,148,0.08)] hover:-translate-y-1 animate-staggerFadeIn flex flex-col"
                style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'backwards' }}
              >
                <div className="h-12 w-12 rounded bg-signal/10 flex items-center justify-center mb-6 group-hover:bg-signal/20 transition-colors duration-200 text-xl" aria-hidden="true">
                  {feature.icon}
                </div>
                <h3 className="font-mono text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-sm text-white/70 leading-relaxed mb-4">{feature.desc}</p>
                <ul className="space-y-2 mt-auto">
                  {feature.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-white/60">
                      <span className="text-signal mt-0.5 flex-shrink-0">✓</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-mono text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            Choose a plan that fits your needs and start integrating in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/packages"
              className="inline-flex items-center justify-center rounded-sm bg-signal px-8 py-4 font-mono text-sm font-bold text-white transition-all duration-200 hover:bg-signal/90 hover:shadow-lg hover:shadow-signal/30 hover:-translate-y-1 touch-target"
            >
              View Pricing
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-sm border border-white/20 bg-transparent px-8 py-4 font-mono text-sm font-bold text-white transition-all duration-200 hover:bg-white/5 hover:border-white/30 touch-target"
            >
              Read Documentation
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
