"use client";

export function LoadingState() {
  return (
    <div className="w-full space-y-6 animate-pulse">
      {/* Score skeleton */}
      <div className="flex justify-center">
        <div className="h-20 w-32 rounded bg-border/50" />
      </div>

      {/* Validation skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-40 rounded bg-border/50" />
        <div className="space-y-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-3 rounded bg-border/30" style={{ width: `${70 + Math.random() * 30}%` }} />
          ))}
        </div>
      </div>

      {/* Judge skeleton */}
      <div className="space-y-3">
        <div className="h-4 w-36 rounded bg-border/50" />
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="flex justify-between">
              <div className="h-3 w-24 rounded bg-border/40" />
              <div className="h-3 w-12 rounded bg-border/40" />
            </div>
            <div className="h-1.5 rounded-full bg-border/30" />
          </div>
        ))}
      </div>

      <p className="text-center text-sm text-muted">
        Reviewing skill... this may take 15-45 seconds
      </p>
    </div>
  );
}
