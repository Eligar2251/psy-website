import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Типы для базы данных
export interface BookingInsert {
  name: string;
  phone: string;
  email?: string;
  service: string;
  format: string;
  preferred_time?: string;
  message?: string;
  source?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface ContactInsert {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface SubscriberInsert {
  email: string;
  name?: string;
}