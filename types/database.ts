export type User = {
  id: string;
  username: string;
  github_username: string | null;
  total_xp: number;
  monthly_xp: number;
  level: number;
  coins: number;
  quest_count: number;
  monthly_quest_count: number;
  created_at: string;
};

import type { QuestType } from "../lib/questConfig";

export type Quest = {
  id: string;
  user_id: string;
  username: string;
  source: "github" | "manual";
  type: QuestType | string; // Allow string for legacy compatibility
  xp: number;
  description: string;
  created_at: string;
};

export type Level = {
  level: number;
  xp_required: number;
  coin_reward: number;
  title: string | null;
  special_reward: any; // JSONB type
};

export type LevelUp = {
  id: string;
  user_id: string;
  level: number;
  xp: number;
  claimed: boolean;
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
      quests: {
        Row: Quest;
        Insert: Omit<Quest, "id" | "created_at">;
        Update: Partial<Omit<Quest, "id" | "created_at">>;
      };
      levels: {
        Row: Level;
        Insert: Omit<Level, "level">;
        Update: Partial<Omit<Level, "level">>;
      };
      level_ups: {
        Row: LevelUp;
        Insert: Omit<LevelUp, "id" | "created_at">;
        Update: Partial<Omit<LevelUp, "id" | "created_at">>;
      };
    };
  };
};
