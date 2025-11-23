"use client";

import type { VoiceLogEntry } from "@rivoct/shared";
import { GlassCard } from "./ui/GlassCard";
import { EmptyState } from "./EmptyState";

interface Props {
  logs?: VoiceLogEntry[];
}

const formatDate = (value: VoiceLogEntry["createdAt"]): string => {
  if (!value) return "—";
  if (typeof value === "string") return new Date(value).toLocaleString();
  if (value instanceof Date) return value.toLocaleString();
  if (typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toLocaleString();
  }
  return "—";
};

export const LogsTable = ({ logs = [] }: Props) => {
  if (!logs || logs.length === 0) {
    return (
      <EmptyState 
        icon="📊"
        title="NO_TRAFFIC_DATA"
        description="No voice OTP requests have been made yet. Send your first API request to see delivery logs and analytics here."
        actionLabel="VIEW_API_DOCS"
        actionHref="/docs"
        secondaryLabel="TEST_API"
        secondaryHref="/api"
      />
    );
  }

  return (
    <GlassCard className="overflow-hidden !p-0">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/5 text-sm">
          <thead className="bg-white/5 text-left font-mono text-xs text-mono">
            <tr>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">REQ_ID</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">TARGET</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">STATUS</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">DUR</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">OTP</th>
              <th className="px-6 py-4 font-medium uppercase tracking-wider">TIMESTAMP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-transparent">
            {logs.map((log) => (
              <tr key={log.requestId} className="group transition-colors hover:bg-white/[0.02]">
                <td className="px-6 py-4 font-mono text-xs text-mono group-hover:text-primary">
                  {log.requestId.slice(0, 8)}...
                </td>
                <td className="px-6 py-4 font-mono text-primary">{log.phone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded px-2 py-0.5 font-mono text-xs font-medium ${
                      log.status === "answered"
                        ? "bg-signal/10 text-signal"
                        : log.status === "failed"
                        ? "bg-alert/10 text-alert"
                        : "bg-white/10 text-mono"
                    }`}
                  >
                    {log.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-mono">{log.durationSeconds}s</td>
                <td className="px-6 py-4 font-mono text-xs tracking-widest text-primary/50">
                  {log.otpCode}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-mono">
                  {formatDate(log.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};
