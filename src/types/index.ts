export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Action {
  id: string;
  userId: string;
  type: ActionType;
  points: number;
  metadata: Record<string, any>;
  createdAt: string;
}

export enum ActionType {
  GITHUB_COMMIT = "github_commit",
  GITHUB_PULL_REQUEST = "github_pull_request",
  GITHUB_ISSUE = "github_issue",
  GITHUB_CODE_REVIEW = "github_code_review",
}

export interface LeaderboardEntry {
  user: User;
  totalPoints: number;
  actionCount: number;
}
