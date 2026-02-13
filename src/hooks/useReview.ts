"use client";

import { useState, useCallback, useEffect } from "react";
import type { ReviewResult, ReviewError } from "@/lib/types";

type ReviewState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: ReviewResult; url: string }
  | { status: "error"; error: ReviewError; url: string };

export interface HistoryEntry {
  url: string;
  score: number;
  timestamp: number;
}

const HISTORY_KEY = "skill-health-checker-history";
const MAX_HISTORY = 10;

function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(entries: HistoryEntry[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_HISTORY)));
  } catch {
    // localStorage might be full or disabled
  }
}

export function useReview() {
  const [state, setState] = useState<ReviewState>({ status: "idle" });
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  const submit = useCallback(async (url: string) => {
    setState({ status: "loading" });

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();

      if (json.success) {
        setState({ status: "success", data: json.data, url });

        const entry: HistoryEntry = {
          url,
          score: json.data.averageScore,
          timestamp: Date.now(),
        };
        const updated = [entry, ...loadHistory().filter(
          (h) => h.url !== url
        )].slice(0, MAX_HISTORY);
        saveHistory(updated);
        setHistory(updated);
      } else {
        setState({ status: "error", error: json.error, url });
      }
    } catch {
      setState({
        status: "error",
        error: { type: "server", message: "Network error. Please try again." },
        url,
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return { state, submit, reset, history };
}
