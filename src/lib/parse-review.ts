import type { ReviewResult, ValidationCheck, JudgeCategory, JudgeCriterion } from "./types";

// Strip ANSI escape codes
function stripAnsi(str: string): string {
  return str.replace(/\x1B\[[0-9;]*[a-zA-Z]/g, "").replace(/\x1B\].*?\x07/g, "");
}

function parseValidationChecks(text: string): { checks: ValidationCheck[]; errors: number; warnings: number } {
  const checks: ValidationCheck[] = [];
  let errors = 0;
  let warnings = 0;

  // Match lines like: ✔ skill_md_line_count - SKILL.md line count is 152 (<= 500)
  //                    ⚠ allowed_tools_field - 'allowed-tools' contains unusual tool name(s)
  //                    ✘ some_check - Some failure
  const checkRegex = /^\s*([✔✓⚠✘✗×])\s+(\S+)\s+-\s+(.+)$/gm;
  let match;

  while ((match = checkRegex.exec(text)) !== null) {
    const symbol = match[1];
    const id = match[2];
    const detail = match[3].trim();

    let status: "pass" | "warn" | "fail";
    if (symbol === "✔" || symbol === "✓") {
      status = "pass";
    } else if (symbol === "⚠") {
      status = "warn";
      warnings++;
    } else {
      status = "fail";
      errors++;
    }

    checks.push({ id, label: id.replace(/_/g, " "), status, detail });
  }

  return { checks, errors, warnings };
}

function parseJudgeCategories(text: string): JudgeCategory[] {
  const categories: JudgeCategory[] = [];

  // Split by category headers like "  Description: 100%"
  const categoryRegex = /^\s{2}(\w[\w\s]*?):\s*(\d+)%/gm;
  const categoryPositions: { name: string; percentage: number; start: number }[] = [];

  let match;
  while ((match = categoryRegex.exec(text)) !== null) {
    // Skip lines that look like criteria (have score format "N/N")
    if (match[0].includes("/")) continue;
    categoryPositions.push({
      name: match[1].trim(),
      percentage: parseInt(match[2], 10),
      start: match.index,
    });
  }

  for (let i = 0; i < categoryPositions.length; i++) {
    const cat = categoryPositions[i];
    const end = i + 1 < categoryPositions.length ? categoryPositions[i + 1].start : text.length;
    const section = text.slice(cat.start, end);

    const criteria: JudgeCriterion[] = [];
    // Match: "    specificity: 3/3 - Lists multiple specific..."
    const criterionRegex = /^\s{4}(\w[\w_]*?):\s*(\d+)\/(\d+)\s*-\s*(.+)/gm;
    let critMatch;
    while ((critMatch = criterionRegex.exec(section)) !== null) {
      criteria.push({
        name: critMatch[1].replace(/_/g, " "),
        score: parseInt(critMatch[2], 10),
        maxScore: parseInt(critMatch[3], 10),
        explanation: critMatch[4].trim(),
      });
    }

    // Extract assessment
    const assessmentMatch = section.match(/Assessment:\s*([\s\S]+?)(?:\n\n|\n\s{2}\w|$)/);
    const assessment = assessmentMatch ? assessmentMatch[1].trim() : "";

    categories.push({
      name: cat.name,
      percentage: cat.percentage,
      criteria,
      assessment,
    });
  }

  return categories;
}

function parseAverageScore(text: string): number {
  const match = text.match(/Average Score:\s*(\d+)%/);
  return match ? parseInt(match[1], 10) : 0;
}

export function parseReviewOutput(raw: string): ReviewResult {
  const clean = stripAnsi(raw);

  const { checks, errors, warnings } = parseValidationChecks(clean);
  const overallMatch = clean.match(/Overall:\s*(PASSED|FAILED)/i);

  const judgeCategories = parseJudgeCategories(clean);
  const averageScore = parseAverageScore(clean);

  return {
    validationChecks: checks,
    validationSummary: {
      passed: overallMatch ? overallMatch[1].toUpperCase() === "PASSED" : errors === 0,
      errors,
      warnings,
    },
    judgeCategories,
    averageScore,
    raw: clean,
  };
}
