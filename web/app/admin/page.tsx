"use client";

import { Nav } from "../../components/Nav";
import { RequireAuth } from "../../components/RequireAuth";
import { useCustomers, useIsAdmin } from "../../lib/hooks";
import { useEffect, useState } from "react";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import { getFirestoreClient } from "../../lib/firebaseClient";
import Link from "next/link";

interface SystemStats {
  totalCustomers: number;
  activeCustomers: number;
  suspendedCustomers: number;
  basicUsers: number;
  premiumUsers: number;
  ultraUsers: number;
  totalCallsToday: number;
  totalCallsMonth: number;
  totalRevenueMonth: number;
  avgResponseTime: number;
}

export default function AdminDashboardPage() {
  const isAdmin = useIsAdmin();
  const customers = useCustomers(isAdmin);
  const [stats, setStats] = useState<SystemStats>({
    totalCustomers: 0,
    activeCustomers: 0,
    suspendedCustomers: 0,
    basicUsers: 0,
    premiumUsers: 0,
    ultraUsers: 0,
    totalCallsToday: 0,
    totalCallsMonth: 0,
    totalRevenueMonth: 0,
    avgResponseTime: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) {
      setIsLoading(false);
      return;
    }
    
    if (customers.loading) return;

    // Calculate system-wide statistics
    const active = customers.data.filter((c) => c.status === "active").length;
    const suspended = customers.data.filter((c) => c.status === "suspended").length;

    setStats({
      totalCustomers: customers.data.length,
      activeCustomers: active,
      suspendedCustomers: suspended,
      basicUsers: 0,
      premiumUsers: 0,
      ultraUsers: 0,
      totalCallsToday: 0,
      totalCallsMonth: 0,
      totalRevenueMonth: 0,
      avgResponseTime: 0,
    });

    // Fetch recent system activity
    const fetchActivity = async () => {
      try {
        if (typeof window === "undefined") return;
        const logsRef = collection(getFirestoreClient(), "voice_logs");
        const q = query(logsRef, orderBy("createdAt", "desc"), limit(10));
        const snapshot = await getDocs(q);
        const logs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRecentActivity(logs);
      } catch (err) {
        console.error("Failed to fetch activity:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [isAdmin, customers.data, customers.loading]);

  if (isLoading) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-void font-sans text-mono selection:bg-signal selection:text-void">
          <Nav />
          <main className="mx-auto max-w-7xl px-6 py-12 flex items-center justify-center">
            <div className="text-center">
              <p className="font-mono text-sm text-mono">LOADING_PLATFORM_DATA...</p>
            </div>
          </main>
        </div>
      </RequireAuth>
    );
  }

  if (!isAdmin) {
    return (
      <RequireAuth>
        <div className="min-h-screen bg-void font-sans text-mono selection:bg-signal selection:text-void">
          <Nav />
          <main className="mx-auto max-w-7xl px-6 py-12">
            <div className="border border-alert/20 bg-alert/10 p-6">
              <p className="font-mono text-sm text-alert">
                ACCESS_DENIED: OWNER_PRIVILEGES_REQUIRED
              </p>
              <p className="font-mono text-xs text-mono mt-2">
                This dashboard is restricted to Rivoct platform owners only.
              </p>
            </div>
          </main>
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen bg-void font-sans text-mono selection:bg-signal selection:text-void">
        <Nav />
        <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
          {/* Header */}
          <div className="border-b border-white/10 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
                  PLATFORM_CONTROL_CENTER
                </h1>
                <p className="mt-2 font-mono text-sm text-mono">
                  OWNER_DASHBOARD // SYSTEM_MONITORING // CUSTOMER_OVERSIGHT
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs text-mono">
                <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                <span>ALL_SYSTEMS_OPERATIONAL</span>
              </div>
            </div>
          </div>

          {/* System-Wide Statistics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="TOTAL_CUSTOMERS"
              value={stats.totalCustomers}
              subtitle={`${stats.activeCustomers} ACTIVE • ${stats.suspendedCustomers} SUSPENDED`}
              color="signal"
            />
            <StatCard
              title="CALLS_TODAY"
              value={stats.totalCallsToday}
              subtitle="PLATFORM_WIDE_TRAFFIC"
              color="blue"
            />
            <StatCard
              title="MONTHLY_CALLS"
              value={stats.totalCallsMonth}
              subtitle="CURRENT_BILLING_CYCLE"
              color="purple"
            />
            <StatCard
              title="REVENUE_MTD"
              value={`₹${stats.totalRevenueMonth.toLocaleString()}`}
              subtitle="MONTH_TO_DATE"
              color="green"
            />
          </div>

          {/* Package Distribution */}
          <div className="grid gap-6 lg:grid-cols-3">
            <PackageCard
              name="BASIC"
              description="Entry-level monitoring"
              features={[
                "Up to 100 calls/month",
                "Basic dashboard access",
                "Email support",
                "24hr log retention",
              ]}
              userCount={stats.basicUsers}
              monitoring="MINIMAL"
            />
            <PackageCard
              name="PREMIUM"
              description="Enhanced monitoring"
              features={[
                "Up to 1,000 calls/month",
                "Advanced analytics",
                "Priority support",
                "7-day log retention",
              ]}
              userCount={stats.premiumUsers}
              monitoring="MEDIUM"
            />
            <PackageCard
              name="ULTRA"
              description="Full customer analytics"
              features={[
                "Unlimited calls",
                "Full analytics dashboard",
                "24/7 Slack support",
                "30-day log retention",
              ]}
              userCount={stats.ultraUsers}
              monitoring="FULL"
            />
          </div>

          {/* Quick Actions */}
          <div className="grid gap-6 lg:grid-cols-2">
            <ActionCard
              title="CUSTOMER_MANAGEMENT"
              description="View and manage all platform customers"
              actions={[
                { label: "VIEW_ALL_CUSTOMERS", href: "/admin/customers" },
                { label: "CREATE_NEW_CUSTOMER", href: "/admin/customers" },
              ]}
            />
            <ActionCard
              title="SYSTEM_ANALYTICS"
              description="Deep dive into platform-wide metrics"
              actions={[
                { label: "USAGE_ANALYTICS", href: "/admin/analytics" },
                { label: "REVENUE_REPORTS", href: "/admin/billing" },
              ]}
            />
          </div>

          {/* Recent Platform Activity */}
          <div className="border border-white/10 bg-panel p-6">
            <h2 className="mb-6 font-mono text-lg font-bold text-white">
              RECENT_PLATFORM_ACTIVITY
            </h2>
            <div className="space-y-3">
              {recentActivity.length === 0 ? (
                <p className="font-mono text-sm text-mono">NO_RECENT_ACTIVITY</p>
              ) : (
                recentActivity.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-center justify-between border-b border-white/5 pb-3 last:border-0"
                  >
                    <div className="flex-1">
                      <p className="font-mono text-xs text-white">
                        CUSTOMER: {log.customerId?.substring(0, 12)}...
                      </p>
                      <p className="font-mono text-[10px] text-mono mt-1">
                        PHONE: {log.phone} • STATUS: {log.status?.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-mono">
                        {log.durationSeconds}s • ₹{log.pricingInr}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Owner Notice */}
          <div className="border border-signal/30 bg-signal/5 p-4">
            <p className="font-mono text-xs text-signal">
              🔐 OWNER_MODE_ACTIVE: You have unrestricted access to all customer data,
              analytics, and system controls. This dashboard provides complete visibility
              across the entire Rivoct platform.
            </p>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  color,
}: {
  title: string;
  value: number | string;
  subtitle: string;
  color: "signal" | "blue" | "purple" | "green";
}) {
  const colorClasses = {
    signal: "border-signal/30 bg-signal/5 text-signal",
    blue: "border-blue-500/30 bg-blue-500/5 text-blue-400",
    purple: "border-purple-500/30 bg-purple-500/5 text-purple-400",
    green: "border-emerald-500/30 bg-emerald-500/5 text-emerald-400",
  };

  return (
    <div className={`border ${colorClasses[color]} p-6`}>
      <p className="font-mono text-xs text-mono">{title}</p>
      <p className="mt-2 font-mono text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 font-mono text-[10px] text-mono">{subtitle}</p>
    </div>
  );
}

function PackageCard({
  name,
  description,
  features,
  userCount,
  monitoring,
}: {
  name: string;
  description: string;
  features: string[];
  userCount: number;
  monitoring: string;
}) {
  return (
    <div className="border border-white/10 bg-panel p-6 hover:border-signal/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-mono text-lg font-bold text-white">{name}</h3>
          <p className="font-mono text-xs text-mono mt-1">{description}</p>
        </div>
        <span className="bg-white/10 px-2 py-1 font-mono text-xs text-white">
          {userCount} USERS
        </span>
      </div>
      <div className="space-y-2 mb-4">
        {features.map((feature, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-signal mt-0.5">→</span>
            <p className="font-mono text-xs text-mono">{feature}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 pt-3 mt-3">
        <p className="font-mono text-[10px] text-mono">
          MONITORING_LEVEL: <span className="text-signal">{monitoring}</span>
        </p>
      </div>
    </div>
  );
}

function ActionCard({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions: { label: string; href: string }[];
}) {
  return (
    <div className="border border-white/10 bg-panel p-6">
      <h3 className="font-mono text-lg font-bold text-white mb-2">{title}</h3>
      <p className="font-mono text-xs text-mono mb-4">{description}</p>
      <div className="flex gap-3">
        {actions.map((action, i) => (
          <Link
            key={i}
            href={action.href}
            className="btn-primary px-4 py-2 text-xs"
          >
            {action.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
