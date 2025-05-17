export type User = {
  id: string;
  username: string;
  total_points: number;
  action_count: number;
  created_at: string;
};

export type Action = {
  id: string;
  user_id: string;
  username: string;
  type:
    | "github_commit"
    | "github_pull_request"
    | "github_issue"
    | "github_code_review"
    | string;
  points: number;
  description: string;
  created_at: string;
};

export type ResetHistory = {
  id: string;
  reset_date: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at">;
        Update: Partial<Omit<User, "id" | "created_at">>;
      };
      actions: {
        Row: Action;
        Insert: Omit<Action, "id" | "created_at">;
        Update: Partial<Omit<Action, "id" | "created_at">>;
      };
      reset_history: {
        Row: ResetHistory;
        Insert: Omit<ResetHistory, "id" | "created_at">;
        Update: Partial<Omit<ResetHistory, "id" | "created_at">>;
      };
    };
  };
};
