import { createClient } from "@supabase/supabase-js";

// Supabase configuration
// These should be set in .env.local:
// NEXT_PUBLIC_SUPABASE_URL=your-project-url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database schema
export interface Driver {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
}

export interface RouteGeometry {
  type: "LineString" | "MultiLineString";
  coordinates: [number, number][];
}

export interface Route {
  id: string;
  name: string;
  status: "pending" | "in_progress" | "completed";
  geometry: RouteGeometry;
  weight_kg: number;
  stairs_count: number;
  parking_difficulty: "easy" | "moderate" | "hard";
  assigned_driver_id?: string;
}


export interface EffortScore {
  id: string;
  driver_id: string;
  route_id: string;
  score: number;
  date: string;
  details?: Record<string, unknown>;
}

export interface Assignment {
  id: string;
  driver_id: string;
  route_id: string;
  assigned_at: string;
}

export interface Explanation {
  id: string;
  assignment_id: string;
  driver_id: string;
  route_id: string;
  reason_text: string;
  factors: Record<string, unknown>;
}

export interface FairnessMetric {
  id: string;
  date: string;
  gini_coefficient: number;
}
