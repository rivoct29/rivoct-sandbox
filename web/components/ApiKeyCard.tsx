"use client";

import { useState } from "react";
import { GlassCard } from "./ui/GlassCard";

interface Props {
  apiKey: string;
}

export const ApiKeyCard = ({ apiKey }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassCard>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase text-mono">API_ACCESS_KEY</p>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-signal animate-pulse" />
          <span className="font-mono text-xs text-signal">ACTIVE</span>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <code className="flex-1 rounded border border-panel bg-black/50 px-3 py-2 font-mono text-sm text-primary">
          {apiKey}
        </code>
        <button
          onClick={handleCopy}
          className="group relative flex h-10 w-10 items-center justify-center rounded border border-panel bg-panel/50 transition-colors hover:border-primary hover:bg-primary/10"
        >
          {copied ? (
            <svg
              className="h-4 w-4 text-signal"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="h-4 w-4 text-mono group-hover:text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          )}
        </button>
      </div>

      <p className="mt-4 font-mono text-xs text-mono">
        Use this key in the{" "}
        <span className="text-primary">x-api-key</span> header for all requests.
      </p>
    </GlassCard>
  );
};
