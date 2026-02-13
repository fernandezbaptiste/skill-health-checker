"use client";

import { useState, useCallback } from "react";
import { useReview } from "@/hooks/useReview";
import { SkillInput } from "@/components/SkillInput";
import { ReviewResults } from "@/components/ReviewResults";
import { LoadingState } from "@/components/LoadingState";
import { ErrorDisplay } from "@/components/ErrorDisplay";
import { RecentReviews } from "@/components/RecentReviews";

export default function Home() {
  const { state, submit, reset, history } = useReview();
  const [inputKey, setInputKey] = useState(0);
  const [prefillUrl, setPrefillUrl] = useState("");

  const handleHistorySelect = useCallback(
    (url: string) => {
      setPrefillUrl(url);
      setInputKey((k) => k + 1);
      reset();
    },
    [reset]
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <main className="w-full max-w-2xl flex flex-col items-center gap-8">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-accent font-sans">
            Skill Health Checker
          </h1>
          <p className="text-muted text-sm">
            Paste a GitHub link to a tessl skill and get your eval score
            instantly.
          </p>
        </div>

        <div className="w-full rounded-lg border border-border bg-card p-6">
          <SkillInput
            key={inputKey}
            onSubmit={submit}
            loading={state.status === "loading"}
            initialUrl={prefillUrl}
          />
        </div>

        {state.status === "idle" && history.length > 0 && (
          <RecentReviews history={history} onSelect={handleHistorySelect} />
        )}

        {state.status === "loading" && <LoadingState />}

        {state.status === "error" && (
          <ErrorDisplay error={state.error} />
        )}

        {state.status === "success" && (
          <>
            <ReviewResults data={state.data} />
            <button
              onClick={reset}
              className="text-xs text-muted hover:text-foreground transition-colors underline"
            >
              Check another skill
            </button>
          </>
        )}

        <p className="text-xs text-muted/50">
          Powered by{" "}
          <a
            href="https://tessl.io"
            className="underline hover:text-muted transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            tessl
          </a>
        </p>
      </main>
    </div>
  );
}
