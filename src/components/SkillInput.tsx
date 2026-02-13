"use client";

import { useState, useCallback, useRef, type FormEvent, type KeyboardEvent } from "react";

interface SkillInputProps {
  onSubmit: (url: string) => void;
  loading: boolean;
  initialUrl?: string;
}

export function SkillInput({ onSubmit, loading, initialUrl }: SkillInputProps) {
  const [url, setUrl] = useState(initialUrl || "");
  const urlRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!url.trim() || loading) return;
      onSubmit(url.trim());
    },
    [url, loading, onSubmit]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUrl("");
        urlRef.current?.focus();
      }
    },
    []
  );

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="w-full">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="url"
            className="block text-xs font-medium text-muted mb-1.5"
          >
            GitHub URL or shorthand
          </label>
          <input
            ref={urlRef}
            id="url"
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="github:user/repo or https://github.com/user/repo"
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent/50"
            disabled={loading}
            autoFocus
          />
        </div>
        <button
          type="submit"
          disabled={!url.trim() || loading}
          className="w-full rounded-md bg-accent text-background font-medium py-2 text-sm transition-colors hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Reviewing..." : "Check Skill Health"}
        </button>
      </div>
    </form>
  );
}
