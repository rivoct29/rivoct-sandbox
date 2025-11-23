import React from "react";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  // keep prop for compatibility but avoid layout-changing side effects
  hoverEffect?: boolean;
};

export const GlassCard = React.memo(function GlassCard({ children, className = "", hoverEffect = false }: GlassCardProps) {
  // Avoid rendering decorative elements that may trigger reflows or re-renders
  // when used in lists. The visual hover decoration is intentionally subtle
  // and will be provided by CSS only to avoid JS-driven DOM churn.
  const base = `relative overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-sm ${className}`;

  return (
    <div className={base}>
      {/* Decorative element removed to avoid layout shifts when mapping lists */}
      {children}
    </div>
  );
});
