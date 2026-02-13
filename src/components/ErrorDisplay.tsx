"use client";

import type { ReviewError } from "@/lib/types";

interface ErrorDisplayProps {
  error: ReviewError;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  return (
    <div className="w-full rounded-lg border border-error/30 bg-error/5 p-4 animate-fade-in">
      <p className="text-sm text-error font-medium">{error.message}</p>

      {error.type === "skill_not_specified" && error.availableSkills && error.availableSkills.length > 0 && (
        <div className="mt-3 space-y-2">
          <p className="text-xs text-muted">Available skills:</p>
          <div className="flex flex-wrap gap-2">
            {error.availableSkills.map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 text-xs rounded border border-border bg-card text-foreground"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {error.type === "timeout" && (
        <p className="mt-2 text-xs text-muted">
          The review took too long. Try again or check if the repository is accessible.
        </p>
      )}

      {error.type === "not_found" && (
        <p className="mt-2 text-xs text-muted">
          Make sure the repository exists and contains a valid tessl skill.
        </p>
      )}
    </div>
  );
}
