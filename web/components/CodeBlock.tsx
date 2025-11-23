"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock = ({ code, language = "bash", showLineNumbers = false }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group">
      <div data-testid="codeblock" role="region" aria-label="Code block" className="bg-[#0D0D0D] rounded-lg p-4 font-mono text-sm overflow-x-auto terminal-example">
        <pre className="text-white/80 leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/10 hover:bg-white/20 border border-white/10 rounded px-3 py-1.5 text-xs font-mono text-white flex items-center gap-2 touch-target"
        aria-label="Copy code to clipboard"
      >
        {copied ? (
          <>
            <span>✓</span>
            <span>Copied!</span>
          </>
        ) : (
          <>
            <span>📋</span>
            <span>Copy</span>
          </>
        )}
      </button>
    </div>
  );
};
