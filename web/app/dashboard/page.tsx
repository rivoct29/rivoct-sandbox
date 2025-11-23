"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Nav } from "../../components/Nav";
import { RequireAuth } from "../../components/RequireAuth";
import { UsageSummary } from "../../components/UsageSummary";
import { ChartCard } from "../../components/ChartCard";
import { LogsTable } from "../../components/LogsTable";
import { ApiKeyCard } from "../../components/ApiKeyCard";
import { useAuthUser, useCustomerProfile, useUsageSummary, useVoiceLogs, useApiKeys } from "../../lib/hooks";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcome = searchParams?.get("welcome") === "true";
  
  const { user } = useAuthUser();
  const profile = useCustomerProfile(user?.uid ?? undefined);
  const usage = useUsageSummary(profile?.customerId);
  const logs = useVoiceLogs(profile?.customerId, 20);
  const apiKeys = useApiKeys(profile?.customerId);

  const activeKey = apiKeys.data?.[0]?.id ?? "LOADING...";
  
  // Redirect to /packages if user has no active package
  useEffect(() => {
    if (profile && !profile.package) {
      router.push("/packages");
    }
  }, [profile, router]);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-void font-sans text-mono selection:bg-signal selection:text-void">
        <Nav />
        <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
          {/* Welcome Banner for New Customers */}
          {isWelcome && profile?.package && (
            <div className="border border-signal bg-signal/5 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-signal/20 rounded-full flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>
                <div className="flex-1">
                  <h2 className="font-mono text-xl font-bold text-white mb-2">
                    WELCOME_TO_RIVOCT_{profile.package.toUpperCase()}
                  </h2>
                  <p className="text-white/70 mb-4">
                    Your account is now active! Your API key is ready below. Check your email for integration guides and support resources.
                  </p>
                  <div className="flex gap-4 text-sm">
                    <a href="/docs" className="text-signal hover:underline font-mono">
                      [ VIEW_DOCUMENTATION ]
                    </a>
                    <a href="/settings" className="text-signal hover:underline font-mono">
                      [ CONFIGURE_WEBHOOKS ]
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-end justify-between border-b border-white/10 pb-6">
            <div>
              <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
                CUSTOMER_DASHBOARD
              </h1>
              <div className="mt-2 flex items-center gap-2 font-mono text-sm text-mono">
                <span className="h-2 w-2 rounded-full bg-signal" />
                <span>MONITORING_ACTIVE</span>
                <span className="text-white/20">|</span>
                <span>CID: {profile?.customerId ?? "UNKNOWN"}</span>
                {profile?.package && (
                  <>
                    <span className="text-white/20">|</span>
                    <span className="text-signal">TIER: {profile.package.toUpperCase()}</span>
                  </>
                )}
              </div>
            </div>
            <div className="font-mono text-xs text-mono">
              LAST_SYNC: {new Date().toLocaleTimeString()}
            </div>
          </div>

          <UsageSummary usage={usage.data ?? undefined} loading={usage.loading} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ChartCard logs={logs.data} />
            </div>
            <div>
              <ApiKeyCard apiKey={activeKey} />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-mono text-lg font-bold text-white">
                TRAFFIC_LOGS
              </h2>
              <button className="border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-mono hover:bg-white/10 hover:text-white transition-colors">
                EXPORT_CSV
              </button>
            </div>
            <LogsTable logs={logs.data} />
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-mono text-white font-mono">LOADING_DASHBOARD...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
