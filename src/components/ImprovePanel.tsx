"use client";

import { useState, useCallback } from "react";
import type { ReviewResult } from "@/lib/types";
import { generateImprovePrompt, getWeakAreasSummary } from "@/lib/generate-prompt";

interface ImprovePanelProps {
  data: ReviewResult;
}

export function ImprovePanel({ data }: ImprovePanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const prompt = generateImprovePrompt(data);
  const weakAreas = getWeakAreasSummary(data);

  const handleCopy = useCallback(async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = prompt;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [prompt]);

  // Don't show if score is already 100%
  if (!prompt || data.averageScore >= 100) return null;

  return (
    <div className="w-full rounded-lg border border-border bg-card p-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-sm font-medium text-foreground">
          Improve This Skill
        </h3>
        <span className="text-xs text-muted">
          {weakAreas.length} area{weakAreas.length !== 1 ? "s" : ""} to improve
        </span>
      </button>

      {expanded && (
        <div className="mt-4 space-y-4">
          {/* Weak areas list */}
          <div className="space-y-2">
            {weakAreas.map((area) => (
              <div
                key={`${area.category}-${area.criterion}`}
                className="flex items-start gap-2 text-xs"
              >
                <span className="text-warning flex-shrink-0 mt-0.5">{"\u25CF"}</span>
                <div>
                  <span className="font-medium text-foreground/80">
                    {area.category} &gt; {area.criterion}
                  </span>
                  <span className="text-muted ml-1">
                    ({area.score}/{area.maxScore})
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Copy prompt button */}
          <button
            onClick={handleCopy}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-border/50 transition-colors"
          >
            {copied ? "Copied!" : "Copy Claude Code Prompt"}
          </button>

          {/* Step-by-step guide */}
          <div className="border-t border-border pt-3">
            <p className="text-xs font-medium text-muted mb-2">How to improve:</p>
            <ol className="text-xs text-muted/80 space-y-1.5 list-decimal list-inside">
              <li>
                Install tessl:{" "}
                <code className="text-foreground/70 bg-border/50 px-1 rounded font-mono text-[11px]">
                  npm install -g tessl
                </code>
              </li>
              <li>
                Log in:{" "}
                <code className="text-foreground/70 bg-border/50 px-1 rounded font-mono text-[11px]">
                  tessl login
                </code>
              </li>
              <li>Clone the skill repo and open it in Claude Code</li>
              <li>Paste the copied prompt into Claude Code</li>
              <li>
                Verify with:{" "}
                <code className="text-foreground/70 bg-border/50 px-1 rounded font-mono text-[11px]">
                  tessl skill review
                </code>
              </li>
              <li>
                Publish:{" "}
                <code className="text-foreground/70 bg-border/50 px-1 rounded font-mono text-[11px]">
                  tessl skill publish
                </code>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
