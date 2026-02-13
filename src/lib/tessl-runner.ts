import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

const TIMEOUT_MS = 120_000;

export interface TesslResult {
  stdout: string;
  stderr: string;
}

export interface TesslError {
  type: "timeout" | "not_found" | "skill_not_specified" | "execution";
  message: string;
  availableSkills?: string[];
}

export async function runTesslReview(
  repoUrl: string,
  skillName?: string
): Promise<{ ok: true; result: TesslResult } | { ok: false; error: TesslError }> {
  const args = ["skill", "review", repoUrl];

  if (skillName) {
    args.push("--skill", skillName);
  }

  const env = {
    ...process.env,
    // Force non-interactive mode / no color
    NO_COLOR: "1",
    FORCE_COLOR: "0",
    CI: "true",
  };

  try {
    const { stdout, stderr } = await execFileAsync("tessl", args, {
      timeout: TIMEOUT_MS,
      maxBuffer: 1024 * 1024, // 1MB
      env,
    });

    return { ok: true, result: { stdout, stderr } };
  } catch (err: unknown) {
    const error = err as { killed?: boolean; code?: string | number; stdout?: string; stderr?: string; message?: string };

    if (error.killed) {
      return {
        ok: false,
        error: { type: "timeout", message: "Review timed out after 120 seconds" },
      };
    }

    const output = (error.stdout || "") + (error.stderr || "");

    // Detect "skill not found" with available skills list
    const skillsMatch = output.match(/Available skills?:\s*(.+)/i);
    if (skillsMatch || output.includes("multiple skills") || output.includes("specify a skill")) {
      const skills = skillsMatch
        ? skillsMatch[1].split(/[,\s]+/).filter(Boolean)
        : [];
      return {
        ok: false,
        error: {
          type: "skill_not_specified",
          message: "This repository contains multiple skills. Please specify which skill to review.",
          availableSkills: skills,
        },
      };
    }

    if (output.includes("not found") || output.includes("does not exist") || output.includes("404")) {
      return {
        ok: false,
        error: { type: "not_found", message: "Repository or skill not found" },
      };
    }

    return {
      ok: false,
      error: {
        type: "execution",
        message: error.message || "Failed to run tessl skill review",
      },
    };
  }
}
