"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { VoiceLogEntry } from "@rivoct/shared";
import { GlassCard } from "./ui/GlassCard";

interface Props {
  logs?: VoiceLogEntry[];
}

const toDateKey = (value: VoiceLogEntry["createdAt"]): string | undefined => {
  if (!value) {
    return undefined;
  }
  if (typeof value === "string") {
    return value.slice(0, 10);
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toISOString().slice(0, 10);
  }
  return undefined;
};

const aggregateByDay = (logs: VoiceLogEntry[]) => {
  const map = new Map<string, number>();
  logs.forEach((log) => {
    const key = toDateKey(log.createdAt) ?? new Date().toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + 1);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, count]) => ({ date, count }));
};

export const ChartCard = ({ logs = [] }: Props) => {
  const data = aggregateByDay(logs);

  return (
    <GlassCard hoverEffect>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-xs uppercase text-mono">TRAFFIC_VOLUME</p>
          <p className="mt-1 font-mono text-2xl text-primary">{logs.length} <span className="text-sm text-mono">CALLS</span></p>
        </div>
      </div>
      <div className="mt-6 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, bottom: 10, left: -20 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00FF94" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00FF94" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
                dataKey="date" 
                stroke="#888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                tickFormatter={(val) => val.slice(5)}
            />
            <YAxis 
                stroke="#888" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
            />
            <Tooltip 
                contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#333', color: '#EDEDED' }}
                itemStyle={{ color: '#00FF94' }}
                cursor={{ stroke: '#333' }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#00FF94"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
};
