"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";

interface Package {
  id: "basic" | "premium" | "ultra";
  name: string;
  tagline: string;
  pricePerMinute: number;
  monthlyBase: number;
  features: {
    included: string[];
    limits: {
      label: string;
      value: string;
    }[];
  };
  highlight?: boolean;
}

const packages: Package[] = [
  {
    id: "basic",
    name: "Basic",
    tagline: "Perfect for startups and MVPs",
    pricePerMinute: 0.40,
    monthlyBase: 999,
    features: {
      included: [
        "Voice OTP delivery",
        "Standard routing (2 carriers)",
        "Basic monitoring (24hr logs)",
        "Simple usage dashboard",
        "Email support (48h response)",
        "API key management",
        "99.5% uptime SLA"
      ],
      limits: [
        { label: "Included Minutes", value: "5,000/month" },
        { label: "Additional Minutes", value: "₹0.40/min" },
        { label: "API Rate Limit", value: "100 req/min" },
        { label: "Monitoring Level", value: "Minimal" }
      ]
    }
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Built for growing enterprises",
    pricePerMinute: 0.35,
    monthlyBase: 4999,
    highlight: true,
    features: {
      included: [
        "Everything in Basic, plus:",
        "Priority routing (6 carriers)",
        "Medium monitoring (7-day logs)",
        "Enhanced analytics & exports",
        "Real-time call tracking",
        "Priority email support (12h response)",
        "Webhook callbacks",
        "Custom caller ID",
        "Fraud detection filters",
        "99.9% uptime SLA"
      ],
      limits: [
        { label: "Included Minutes", value: "20,000/month" },
        { label: "Additional Minutes", value: "₹0.35/min" },
        { label: "API Rate Limit", value: "500 req/min" },
        { label: "Monitoring Level", value: "Medium" }
      ]
    }
  },
  {
    id: "ultra",
    name: "Ultra",
    tagline: "Maximum scale, full analytics",
    pricePerMinute: 0.30,
    monthlyBase: 14999,
    features: {
      included: [
        "Everything in Premium, plus:",
        "Enterprise routing (12 carriers)",
        "Full monitoring (30-day logs)",
        "Advanced analytics dashboard",
        "Customer behavior insights",
        "Success rate tracking",
        "API keys for end-customers",
        "24/7 email + Slack support",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options",
        "Multi-region deployment",
        "Flash call fallback",
        "Advanced fraud ML models",
        "99.99% uptime SLA"
      ],
      limits: [
        { label: "Included Minutes", value: "75,000/month" },
        { label: "Additional Minutes", value: "₹0.30/min" },
        { label: "API Rate Limit", value: "Unlimited" },
        { label: "Monitoring Level", value: "Full Analytics" }
      ]
    }
  }
];

export default function PackagesPage() {
  const router = useRouter();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handleSelectPackage = (packageId: string) => {
    setSelectedPackage(packageId);
    // Redirect to checkout with package selection
    router.push(`/checkout?package=${packageId}`);
  };

  return (
    <main className="min-h-screen bg-void text-primary selection:bg-signal selection:text-white">
      <Nav />

      {/* Background Grid */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-transparent to-void" />
      </div>

      {/* Breadcrumbs */}
      <section className="relative z-10 pt-32 pb-8 px-4 xs:px-6">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-mono text-white/50 mb-8">
            <Link href="/" className="hover:text-signal transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Pricing</span>
          </nav>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative z-10 pb-12 px-4 xs:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-signal/20 bg-signal/5 px-3 py-1.5 mb-6">
            <span className="font-mono text-xs font-medium text-signal tracking-wider">Transparent Pricing</span>
          </div>
          
          <h1 className="font-mono text-3xl xs:text-4xl sm:text-5xl font-bold text-white mb-5 sm:mb-6">
            Choose Your Scale
          </h1>
          
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed px-4">
            Start with what you need. Upgrade as you grow. No hidden fees, no vendor lock-in.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative z-10 pb-16 sm:pb-24 px-4 xs:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`relative border rounded-lg ${
                  pkg.highlight
                    ? "border-signal bg-signal/5 shadow-[0_4px_24px_rgba(0,255,148,0.12)] md:col-span-2 lg:col-span-1"
                    : "border-white/10 bg-white/[0.02]"
                } p-6 sm:p-8 transition-all duration-200 hover:shadow-[0_4px_24px_rgba(0,255,148,0.08)] hover:-translate-y-1 animate-fadeIn flex flex-col`}
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-signal px-3 sm:px-4 py-1 rounded-sm">
                    <span className="font-mono text-[10px] xs:text-xs font-bold text-white">Most Popular</span>
                  </div>
                )}

                <div className="mb-6 sm:mb-8">
                  <h3 className="font-mono text-xl sm:text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <p className="text-xs sm:text-sm text-white/70">{pkg.tagline}</p>
                </div>

                <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-white/10">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl sm:text-4xl font-bold font-mono text-white">₹{pkg.monthlyBase.toLocaleString('en-IN')}</span>
                    <span className="text-xs sm:text-sm text-white/50">/month</span>
                  </div>
                  <p className="text-[10px] xs:text-xs text-[#C4C4C4] font-mono">
                    Then ₹{pkg.pricePerMinute.toFixed(2)}/min after included quota
                  </p>
                </div>

                {/* Usage Limits */}
                <div className="mb-6 sm:mb-8 space-y-2.5 sm:space-y-3">
                  {pkg.features.limits.map((limit, i) => (
                    <div key={i} className="flex justify-between items-center text-xs sm:text-sm gap-3 sm:gap-4">
                      <span className="text-white/70">{limit.label}</span>
                      <span className="font-mono font-bold text-white text-right">{limit.value}</span>
                    </div>
                  ))}
                </div>

                {/* Features List */}
                <ul className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 flex-1">
                  {pkg.features.included.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                      <span className="text-signal mt-0.5 flex-shrink-0">✓</span>
                      <span className="text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleSelectPackage(pkg.id)}
                  disabled={selectedPackage === pkg.id}
                  className={`w-full py-3.5 sm:py-4 rounded-sm font-mono text-xs sm:text-sm font-bold transition-all duration-200 touch-target ${
                    pkg.highlight
                      ? "bg-signal text-white hover:bg-signal/90 hover:shadow-lg hover:shadow-signal/30"
                      : "border border-white/20 bg-transparent text-white hover:bg-white/5 hover:border-white/30"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  aria-label={`Select ${pkg.name} plan`}
                >
                  {selectedPackage === pkg.id ? "Processing..." : "Select Plan"}
                </button>
              </div>
            ))}
          </div>

          {/* Monitoring Level Clarification */}
          <div className="mt-16 border border-signal/20 bg-signal/5 rounded-lg p-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-signal/20 rounded-full flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="font-mono text-lg font-bold text-white mb-2">Customer Monitoring vs Owner Access</h3>
                <p className="text-sm text-white/70 leading-relaxed">
                  <strong className="text-white">Customer Plans:</strong> Monitoring capabilities for tracking your own API usage and end-customer behavior. 
                  Ultra plan includes full analytics for managing API keys distributed to your end-customers.
                </p>
                <p className="text-sm text-white/70 leading-relaxed mt-2">
                  <strong className="text-white">Owner/Admin Access:</strong> Platform-wide control panel for Rivoct owners only. 
                  Monitor all customers, manage accounts, view system-wide analytics, and control the entire platform.
                </p>
              </div>
            </div>
          </div>

          {/* Enterprise CTA */}
          <div className="mt-8 border border-white/10 bg-white/[0.02] rounded-lg p-12 text-center hover:border-white/20 transition-all duration-200">
            <h3 className="font-mono text-2xl font-bold text-white mb-4">Need a Custom Solution?</h3>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto leading-relaxed">
              Volume discounts, custom SLAs, dedicated infrastructure, and white-label options available for enterprises.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-sm border border-white/20 bg-transparent px-8 py-3 font-mono text-sm font-bold text-white hover:bg-white/5 hover:border-white/30 transition-all duration-200 touch-target"
            >
              Contact Sales
            </Link>
          </div>

          {/* FAQ Section */}
          <div className="mt-16">
            <h3 className="font-mono text-2xl font-bold text-white mb-8 text-center">Frequently Asked</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  q: "What counts as a 'minute'?",
                  a: "One successful voice OTP call = 1 minute charge, regardless of actual call duration. Failed calls are not charged."
                },
                {
                  q: "Can I change plans later?",
                  a: "Yes. Upgrade/downgrade anytime. Changes take effect at the start of your next billing cycle."
                },
                {
                  q: "What happens if I exceed my quota?",
                  a: "Overage minutes are automatically charged at your plan's per-minute rate. No service interruption."
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes. All new accounts get 100 free test calls in sandbox mode before upgrading to a paid plan."
                }
              ].map((faq, i) => (
                <div 
                  key={i} 
                  className="border border-white/10 bg-white/[0.02] rounded-lg p-6 hover:border-white/20 transition-all duration-200"
                >
                  <h4 className="font-mono font-bold text-white mb-2">{faq.q}</h4>
                  <p className="text-sm text-white/70 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
