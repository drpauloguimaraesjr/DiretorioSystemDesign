'use client';

import { useState } from 'react';

interface CodeDisplayProps {
  code: string;
  title?: string;
}

export default function CodeDisplay({ code, title }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lines = code.split('\n');

  return (
    <div className="border border-border bg-card rounded-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <span className="font-mono text-xs text-muted-foreground">
          {title || 'código'}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Copiado</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
              <span>Copiar</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-auto code-scrollbar max-h-[400px]">
        <div className="flex">
          {/* Line numbers */}
          <div className="flex-shrink-0 py-4 px-3 text-right border-r border-border bg-muted/20 select-none">
            {lines.map((_, i) => (
              <div key={i} className="font-mono text-xs text-muted-foreground/50 leading-6">
                {i + 1}
              </div>
            ))}
          </div>
          
          {/* Code content */}
          <pre className="flex-1 py-4 px-4 overflow-x-auto">
            <code className="font-mono text-xs leading-6 text-foreground whitespace-pre">
              {code}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
