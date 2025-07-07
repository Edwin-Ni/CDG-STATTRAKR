// Centralized Quest Configuration
// This file defines all quest types, XP values, and tag bonuses used throughout the application
// To add a new manual quest type:
// 1. Add it to QuestType in questConfig.ts
// 2. Add it to MANUAL_QUEST_TYPES array
// 3. Add XP value to QUEST_XP
// 4. Add display info to QUEST_DISPLAY
// The form will automatically include it!

// To modify XP values:
// Just change QUEST_XP or TAG_XP - the form updates automatically

// To add new tags:
// Add to TAG_XP and TAG_DISPLAY - form gets new options automatically

// Core quest types available in the system
export type QuestType =
  | "github_commit"
  | "github_pr_opened"
  | "github_pr_merged"
  | "github_pr_review"
  | "github_issue"
  | "github_issue_comment";

// Manual quest types (subset available for manual entry)
export type ManualQuestType = Extract<
  QuestType,
  "github_commit" | "github_pr_opened" | "github_pr_merged" | "github_pr_review"
>;

// Array of manual quest types for iteration
export const MANUAL_QUEST_TYPES: readonly ManualQuestType[] = [
  "github_commit",
  "github_pr_opened",
  "github_pr_merged",
  "github_pr_review",
] as const;

// Tag types for bonus XP
export type TagType = "bug" | "feature" | "hotfix" | "refactor" | "";

// XP values for each quest type
export const QUEST_XP: Record<QuestType, number> = {
  github_commit: 1,
  github_pr_opened: 5,
  github_pr_merged: 8,
  github_pr_review: 3,
  github_issue: 3,
  github_issue_comment: 2,
} as const;

// Bonus XP for tags
export const TAG_XP: Record<Exclude<TagType, "">, number> = {
  bug: 5,
  feature: 6,
  hotfix: 6,
  refactor: 4,
} as const;

// Quest type display information
export const QUEST_DISPLAY: Record<QuestType, { name: string; icon: string }> =
  {
    github_commit: { name: "Commit", icon: "📝" },
    github_pr_opened: { name: "PR Opened", icon: "🔀" },
    github_pr_merged: { name: "PR Merged", icon: "✅" },
    github_pr_review: { name: "PR Review", icon: "👀" },
    github_issue: { name: "Issue", icon: "🐛" },
    github_issue_comment: { name: "Comment", icon: "💬" },
  } as const;

// Tag display information
export const TAG_DISPLAY: Record<
  Exclude<TagType, "">,
  { name: string; description: string }
> = {
  bug: { name: "Bug Fix", description: "Fixing a bug or defect" },
  feature: { name: "Feature", description: "Adding new functionality" },
  hotfix: { name: "Hotfix", description: "Critical production fix" },
  refactor: {
    name: "Refactor",
    description: "Code improvement without new features",
  },
} as const;

// GitHub webhook mapping (for backward compatibility and webhook processing)
export const WEBHOOK_XP_VALUES = {
  push: QUEST_XP.github_commit, // Commits (push event)
  pull_request_opened: QUEST_XP.github_pr_opened,
  pull_request_merged: QUEST_XP.github_pr_merged,
  pull_request_review: QUEST_XP.github_pr_review,
  issues: QUEST_XP.github_issue,
  issue_comment: QUEST_XP.github_issue_comment,
} as const;

// Utility functions
export function getQuestXP(questType: QuestType, tag?: TagType): number {
  const baseXP = QUEST_XP[questType];
  if (!tag) {
    return baseXP;
  }
  return baseXP + TAG_XP[tag];
}

export function getQuestDisplayName(questType: QuestType): string {
  return QUEST_DISPLAY[questType].name;
}

export function getQuestIcon(questType: QuestType): string {
  return QUEST_DISPLAY[questType].icon;
}

export function getTagDisplayName(tag: Exclude<TagType, "">): string {
  return TAG_DISPLAY[tag].name;
}

// Extract tags from description text
export function extractTags(description: string): TagType[] {
  const tagPattern = /#(bug|feature|hotfix|refactor)\b/gi;
  const matches = description.match(tagPattern) || [];
  return matches.map((tag) => tag.substring(1).toLowerCase() as TagType);
}

// Validate quest type
export function isValidQuestType(type: string): type is QuestType {
  return Object.keys(QUEST_XP).includes(type);
}

// Validate manual quest type
export function isValidManualQuestType(type: string): type is ManualQuestType {
  return [
    "github_commit",
    "github_pr_opened",
    "github_pr_merged",
    "github_pr_review",
  ].includes(type);
}

// Validate tag type
export function isValidTagType(tag: string): tag is TagType {
  return tag === "" || Object.keys(TAG_XP).includes(tag);
}
