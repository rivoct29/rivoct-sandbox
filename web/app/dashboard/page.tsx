"use client";

import { Nav } from "../../components/Nav";
import { RequireAuth } from "../../components/RequireAuth";
import { UsageSummary } from "../../components/UsageSummary";
import { ChartCard } from "../../components/ChartCard";
import { LogsTable } from "../../components/LogsTable";
import { ApiKeyCard } from "../../components/ApiKeyCard";
import { useAuthUser, useCustomerProfile, useUsageSummary, useVoiceLogs, useApiKeys } from "../../lib/hooks";

export default function DashboardPage() {
  const { user } = useAuthUser();
  const profile = useCustomerProfile(user?.uid ?? undefined);
  const usage = useUsageSummary(profile?.customerId);
  const logs = useVoiceLogs(profile?.customerId, 20);
  const apiKeys = useApiKeys(profile?.customerId);

  const activeKey = apiKeys.data?.[0]?.id ?? "LOADING...";

  return (
    <RequireAuth>
      <div className="min-h-screen bg-void font-sans text-mono selection:bg-signal selection:text-void">
        <Nav />
        <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
          <div className="flex items-end justify-between border-b border-white/10 pb-6">
            <div>
              <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
                NETWORK_STATUS
              </h1>
              <div className="mt-2 flex items-center gap-2 font-mono text-sm text-mono">
                <span className="h-2 w-2 rounded-full bg-signal animate-pulse" />
                <span>SYSTEM_ONLINE</span>
                <span className="text-white/20">|</span>
                <span>CID: {profile?.customerId ?? "UNKNOWN"}</span>
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
