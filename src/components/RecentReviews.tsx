"use client";

import type { HistoryEntry } from "@/hooks/useReview";

interface RecentReviewsProps {
  history: HistoryEntry[];
  onSelect: (url: string) => void;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-error";
}

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function RecentReviews({ history, onSelect }: RecentReviewsProps) {
  if (history.length === 0) return null;

  return (
    <div className="w-full">
      <p className="text-xs text-muted/50 mb-2">Recent reviews</p>
      <div className="space-y-1">
        {history.map((entry) => (
          <button
            key={`${entry.url}-${entry.timestamp}`}
            onClick={() => onSelect(entry.url)}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded text-xs hover:bg-card transition-colors text-left group"
          >
            <span className="text-muted group-hover:text-foreground transition-colors truncate mr-2">
              {entry.url}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className={`font-bold ${getScoreColor(entry.score)}`}>
                {entry.score}%
              </span>
              <span className="text-muted/30">{timeAgo(entry.timestamp)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
