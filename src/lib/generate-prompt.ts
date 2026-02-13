import type { ReviewResult, JudgeCategory, JudgeCriterion } from "./types";

interface WeakArea {
  category: string;
  criterion: string;
  score: number;
  maxScore: number;
  explanation: string;
}

function findWeakAreas(result: ReviewResult): WeakArea[] {
  const weakAreas: WeakArea[] = [];

  for (const category of result.judgeCategories) {
    for (const criterion of category.criteria) {
      if (criterion.score < criterion.maxScore) {
        weakAreas.push({
          category: category.name,
          criterion: criterion.name,
          score: criterion.score,
          maxScore: criterion.maxScore,
          explanation: criterion.explanation,
        });
      }
    }
  }

  // Sort by severity (lowest scores first)
  weakAreas.sort((a, b) => a.score / a.maxScore - b.score / b.maxScore);
  return weakAreas;
}

function generateFixInstruction(area: WeakArea): string {
  const criterion = area.criterion.toLowerCase();

  if (criterion.includes("specificity")) {
    return "Add more concrete, specific details about what the skill does. List specific actions, tools, or outputs instead of vague descriptions.";
  }
  if (criterion.includes("trigger")) {
    return "Add more natural language trigger phrases that users would actually say. Include variations like questions, commands, and descriptions of the task.";
  }
  if (criterion.includes("completeness")) {
    return "Ensure the description clearly answers WHAT the skill does AND WHEN to use it. Add a 'Use when...' clause with specific trigger scenarios.";
  }
  if (criterion.includes("distinctiveness") || criterion.includes("conflict")) {
    return "Make the skill's niche clearer. Use specific terminology, tool names, or domain language that distinguishes it from other skills.";
  }
  if (criterion.includes("conciseness")) {
    return "Remove padding and unnecessary explanations. Use tables for reference, and avoid explaining concepts that Claude already knows.";
  }
  if (criterion.includes("actionability")) {
    return "Add fully executable commands and copy-paste ready examples. Replace pseudocode with real, runnable commands.";
  }
  if (criterion.includes("workflow")) {
    return "Add a clear step-by-step workflow section. Number the steps and show the progression from start to finish.";
  }
  if (criterion.includes("progressive") || criterion.includes("disclosure")) {
    return "Reorganize content to progress from essential to advanced. Put common use cases first, edge cases and configuration later.";
  }

  return `Improve the "${area.criterion}" criterion. Current feedback: ${area.explanation}`;
}

export function generateImprovePrompt(result: ReviewResult): string | null {
  const weakAreas = findWeakAreas(result);

  if (weakAreas.length === 0) return null;

  const fixes = weakAreas
    .map((area, i) => {
      const instruction = generateFixInstruction(area);
      return `${i + 1}. **${area.category} > ${area.criterion}** (${area.score}/${area.maxScore}):\n   ${instruction}`;
    })
    .join("\n\n");

  return `Improve this tessl skill based on the following evaluation feedback. The goal is to reach a 100% score.

## Areas to Improve

${fixes}

## Instructions

- Edit the SKILL.md file to address each area above
- Keep changes minimal and targeted — only fix what's flagged
- Maintain the existing structure and voice of the skill
- After making changes, run \`tessl skill review\` to verify improvement`;
}

export function getWeakAreasSummary(result: ReviewResult): WeakArea[] {
  return findWeakAreas(result);
}
