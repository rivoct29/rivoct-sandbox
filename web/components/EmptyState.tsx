import Link from "next/link";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export const EmptyState = ({ 
  icon = "📭", 
  title, 
  description, 
  actionLabel, 
  actionHref,
  secondaryLabel,
  secondaryHref
}: EmptyStateProps) => {
  return (
    <div className="border border-white/10 rounded bg-white/5 p-12 text-center">
      <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="font-mono text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-white/60 mb-6 max-w-md mx-auto leading-relaxed">{description}</p>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
        {actionLabel && actionHref && (
          <Link
            href={actionHref}
            className="inline-block bg-signal text-void font-mono font-bold px-6 py-2 rounded hover:bg-signal/90 transition"
          >
            {actionLabel}
          </Link>
        )}
        {secondaryLabel && secondaryHref && (
          <Link
            href={secondaryHref}
            className="inline-block border border-white/20 text-white font-mono font-bold px-6 py-2 rounded hover:bg-white/5 transition"
          >
            {secondaryLabel}
          </Link>
        )}
      </div>
    </div>
  );
};
