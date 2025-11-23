"use client";

import React, { memo } from "react";
import type { UsageSummaryDTO } from "@rivoct/shared";
import { GlassCard } from "./ui/GlassCard";

interface Props {
  usage?: UsageSummaryDTO | null;
  loading?: boolean;
}

const CircularProgress = ({ value, max, label }: { value: number; max: number; label: string }) => {
  const percentage = max === 0 ? 0 : Math.min(100, (value / max) * 100);
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-16 flex-shrink-0">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 70 70">
          <circle
            className="text-white/5"
            strokeWidth="6"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="35"
            cy="35"
          />
          <circle
            className="text-signal"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="35"
            cy="35"
            style={{ transition: 'none' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-primary">
          {Math.round(percentage)}%
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-mono text-xs uppercase text-mono">{label}</div>
        <div className="mt-1 font-mono text-xl text-primary truncate">
          {value} <span className="text-sm text-mono">/ {max}</span>
        </div>
      </div>
    </div>
  );
};

const UsageSummaryComponent = ({ usage, loading }: Props) => {
  const cards = [
    {
      id: "minute",
      label: "MINUTE_QUOTA",
      count: usage?.minuteCount ?? 0,
      limit: usage?.minuteLimit ?? 0
    },
    {
      id: "daily",
      label: "DAILY_QUOTA",
      count: usage?.dayCount ?? 0,
      limit: usage?.dayLimit ?? 0
    },
    {
      id: "monthly",
      label: "MONTHLY_QUOTA",
      count: usage?.monthCount ?? 0,
      limit: usage?.monthLimit ?? 0
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((card) => (
        <GlassCard key={card.id}>
          {loading ? (
            <div className="h-16 animate-pulse bg-white/5 rounded" />
          ) : (
            <CircularProgress value={card.count} max={card.limit} label={card.label} />
          )}
        </GlassCard>
      ))}
      <GlassCard className="sm:col-span-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-xs uppercase text-mono">TOTAL_SPEND</div>
            <div className="mt-1 font-mono text-2xl text-primary">
              ₹{(usage?.totalCostInr ?? 0).toFixed(2)}
            </div>
          </div>
          <div className="text-right">
             <div className="font-mono text-xs uppercase text-mono">LAST_SYNC</div>
             <div className="mt-1 font-mono text-xs text-mono">
                {usage?.updatedAt ? new Date(usage.updatedAt).toLocaleTimeString() : "—"}
             </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );

};

export const UsageSummary = memo(UsageSummaryComponent);
