// Auto-generated types từ Supabase schema
// Chạy: npx supabase gen types typescript --project-id <ref> > lib/db/database.types.ts
// Hoặc: supabase gen types typescript --local > lib/db/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          timezone: string;
          invite_code: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["workspaces"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["workspaces"]["Insert"]>;
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: "owner" | "admin" | "manager" | "member";
          employee_code: string | null;
          department: string | null;
          position: string | null;
          base_salary: number | null;
          joined_at: string;
          is_active: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["workspace_members"]["Row"], "id" | "joined_at"> & {
          id?: string;
          joined_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["workspace_members"]["Insert"]>;
      };
      attendance_records: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          date: string;
          clock_in_at: string | null;
          clock_out_at: string | null;
          clock_in_method: "gps" | "wifi" | "qr" | "manual" | null;
          clock_out_method: "gps" | "wifi" | "qr" | "manual" | null;
          clock_in_lat: number | null;
          clock_in_lng: number | null;
          clock_out_lat: number | null;
          clock_out_lng: number | null;
          worked_minutes: number | null;
          status: "on-time" | "late" | "absent" | "leave" | "ot";
          note: string | null;
          is_flagged: boolean;
          idempotency_key: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["attendance_records"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["attendance_records"]["Insert"]>;
      };
      checkin_rules: {
        Row: {
          id: string;
          workspace_id: string;
          gps_enabled: boolean;
          gps_lat: number | null;
          gps_lng: number | null;
          gps_radius_m: number;
          wifi_enabled: boolean;
          wifi_ssids: string[] | null;
          qr_enabled: boolean;
          qr_secret: string | null;
          late_threshold_minutes: number;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["checkin_rules"]["Row"], "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["checkin_rules"]["Insert"]>;
      };
      leave_requests: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          leave_type: "annual" | "sick" | "unpaid" | "other";
          start_date: string;
          end_date: string;
          is_half_day: boolean;
          half_day_period: string | null;
          reason: string;
          status: "pending" | "approved" | "rejected" | "cancelled";
          reviewer_id: string | null;
          reviewer_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["leave_requests"]["Row"], "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leave_requests"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          type: string;
          title: string;
          body: string;
          reference_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["notifications"]["Row"], "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      workspace_role: "owner" | "admin" | "manager" | "member";
      checkin_method: "gps" | "wifi" | "qr" | "manual";
      attendance_status: "on-time" | "late" | "absent" | "leave" | "ot";
      leave_type: "annual" | "sick" | "unpaid" | "other";
      leave_status: "pending" | "approved" | "rejected" | "cancelled";
      payroll_status: "calculating" | "ready" | "exported";
    };
  };
}
