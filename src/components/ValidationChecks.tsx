"use client";

import { useState } from "react";
import type { ValidationCheck } from "@/lib/types";

interface ValidationChecksProps {
  checks: ValidationCheck[];
  summary: { passed: boolean; errors: number; warnings: number };
}

const statusIcon: Record<ValidationCheck["status"], string> = {
  pass: "\u2714",
  warn: "\u26A0",
  fail: "\u2718",
};

const statusColor: Record<ValidationCheck["status"], string> = {
  pass: "text-success",
  warn: "text-warning",
  fail: "text-error",
};

export function ValidationChecks({ checks, summary }: ValidationChecksProps) {
  const allPass = summary.errors === 0 && summary.warnings === 0;
  const [expanded, setExpanded] = useState(!allPass);

  return (
    <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <h3 className="text-sm font-medium text-foreground">
          Validation Checks
        </h3>
        <div className="flex items-center gap-2 text-xs">
          {summary.passed ? (
            <span className="text-success">PASSED</span>
          ) : (
            <span className="text-error">FAILED</span>
          )}
          {summary.warnings > 0 && (
            <span className="text-warning">{summary.warnings} warning{summary.warnings !== 1 ? "s" : ""}</span>
          )}
          {summary.errors > 0 && (
            <span className="text-error">{summary.errors} error{summary.errors !== 1 ? "s" : ""}</span>
          )}
          <span className="text-muted/50 group-hover:text-muted transition-colors">
            {expanded ? "\u25B2" : "\u25BC"}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 space-y-1">
          {checks.map((check) => (
            <div
              key={check.id}
              className="flex items-start gap-2 text-xs font-mono py-0.5"
            >
              <span className={`${statusColor[check.status]} flex-shrink-0`}>
                {statusIcon[check.status]}
              </span>
              <span className="text-muted">{check.id}</span>
              <span className="text-muted/30">—</span>
              <span className="text-foreground/80">{check.detail}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
