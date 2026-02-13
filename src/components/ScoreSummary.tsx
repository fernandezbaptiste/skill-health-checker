"use client";

import { useEffect, useState } from "react";

interface ScoreSummaryProps {
  score: number;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-error";
}

export function ScoreSummary({ score }: ScoreSummaryProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    if (score === 0) {
      setDisplayed(0);
      return;
    }

    let frame: number;
    const duration = 600;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="text-center animate-count-up">
      <div className={`text-7xl font-bold font-mono ${getScoreColor(score)}`}>
        {displayed}%
      </div>
      <p className="text-sm text-muted mt-2">Average Score</p>
    </div>
  );
}
