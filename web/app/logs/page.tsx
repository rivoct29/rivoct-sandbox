"use client";

import { useMemo, useState } from "react";
import { Nav } from "../../components/Nav";
import { RequireAuth } from "../../components/RequireAuth";
import { LogsTable } from "../../components/LogsTable";
import { useAuthUser, useCustomerProfile, useVoiceLogs } from "../../lib/hooks";
import clsx from "clsx";

const statuses = ["all", "queued", "answered", "failed"] as const;

type StatusFilter = (typeof statuses)[number];

export default function LogsPage() {
  const { user } = useAuthUser();
  const profile = useCustomerProfile(user?.uid ?? undefined);
  const [filter, setFilter] = useState<StatusFilter>("all");
  const logs = useVoiceLogs(profile?.customerId, 100);

  const filteredLogs = useMemo(() => {
    if (filter === "all") return logs.data;
    return logs.data.filter((log) => log.status === filter);
  }, [filter, logs.data]);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-void font-sans text-mono selection:bg-signal selection:text-void">
        <Nav />
        <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
          <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
                SYSTEM_LOGS
              </h1>
              <p className="mt-2 font-mono text-sm text-mono">
                RETENTION_POLICY: 60_DAYS
              </p>
            </div>
            <div className="flex gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={clsx(
                    "border px-3 py-1 font-mono text-xs uppercase transition-all",
                    filter === status
                      ? "border-signal bg-signal/10 text-signal"
                      : "border-white/10 bg-transparent text-mono hover:border-white/30 hover:text-white"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <LogsTable logs={filteredLogs} />
        </main>
      </div>
    </RequireAuth>
  );
}
