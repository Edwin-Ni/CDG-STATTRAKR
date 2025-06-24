import { createClient } from "@supabase/supabase-js";

// These environment variables will need to be set in your project settings
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing");
}

// Create a single supabase client for the entire app (client-side)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
