import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export function GlassCard({ children, className = "", hoverEffect = false }: GlassCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm
        ${hoverEffect ? "transition-all hover:border-white/10 hover:bg-white/[0.04] group" : ""}
        ${className}
      `}
    >
      {hoverEffect && (
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-signal/5 blur-2xl transition-all group-hover:bg-signal/10" />
      )}
      {children}
    </div>
  );
}
