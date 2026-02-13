const SKILL_NAME_REGEX = /^[a-zA-Z0-9_-]+$/;

// Matches github:user/repo shorthand
const GITHUB_SHORTHAND_REGEX = /^github:([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)$/;

// Matches https://github.com/user/repo with optional deeper path
// e.g. https://github.com/tobi/qmd
// e.g. https://github.com/tobi/qmd/blob/main/skills/qmd/SKILL.md
// e.g. https://github.com/tobi/qmd/tree/main/skills/qmd
const GITHUB_HTTPS_REGEX =
  /^https:\/\/github\.com\/([a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+)(?:\/.*)?$/;

// Extracts skill name from deep paths like:
//   /blob/main/skills/my-skill/SKILL.md  -> my-skill
//   /tree/main/skills/my-skill            -> my-skill
//   /blob/<sha>/skills/my-skill/SKILL.md  -> my-skill
const SKILL_FROM_PATH_REGEX = /\/(?:blob|tree)\/[^/]+\/skills\/([a-zA-Z0-9_-]+)/;

export interface ParsedUrl {
  normalized: string;
  extractedSkill?: string;
}

export function validateUrl(input: string): { valid: true; normalized: string; extractedSkill?: string } | { valid: false; reason: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return { valid: false, reason: "URL is required" };
  }

  if (trimmed.length > 500) {
    return { valid: false, reason: "URL is too long" };
  }

  // Try github: shorthand first
  const shorthandMatch = trimmed.match(GITHUB_SHORTHAND_REGEX);
  if (shorthandMatch) {
    return { valid: true, normalized: trimmed };
  }

  // Try https://github.com/... URL
  const httpsMatch = trimmed.match(GITHUB_HTTPS_REGEX);
  if (httpsMatch) {
    const repo = httpsMatch[1];
    const normalized = `github:${repo}`;

    // Try to extract skill name from deep path
    const skillMatch = trimmed.match(SKILL_FROM_PATH_REGEX);
    const extractedSkill = skillMatch ? skillMatch[1] : undefined;

    return { valid: true, normalized, extractedSkill };
  }

  return {
    valid: false,
    reason: "Must be a GitHub URL (https://github.com/user/repo) or shorthand (github:user/repo)",
  };
}

export function validateSkillName(input: string): { valid: true; name: string } | { valid: false; reason: string } {
  const trimmed = input.trim();

  if (!trimmed) {
    return { valid: true, name: "" };
  }

  if (trimmed.length > 100) {
    return { valid: false, reason: "Skill name is too long" };
  }

  if (!SKILL_NAME_REGEX.test(trimmed)) {
    return {
      valid: false,
      reason: "Skill name may only contain letters, numbers, hyphens, and underscores",
    };
  }

  return { valid: true, name: trimmed };
}
