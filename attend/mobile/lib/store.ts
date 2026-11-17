// Global state store (Zustand)
// Fake data layer — same function signatures as real Supabase layer
import { create } from "zustand";
import type {
  User, Workspace, WorkspaceMember, AttendanceRecord,
  LeaveRequest, LeaveBalance, Notification,
} from "@/types";
import {
  SEED_USER, SEED_WORKSPACE, SEED_MEMBERS,
  SEED_ATTENDANCE_TODAY, SEED_ATTENDANCE_HISTORY,
  SEED_LEAVE_BALANCE, SEED_LEAVE_REQUESTS, SEED_NOTIFICATIONS,
} from "./seed";

interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, otp: string) => Promise<void>;
  signOut: () => void;
}

interface WorkspaceSlice {
  workspace: Workspace | null;
  members: WorkspaceMember[];
  setWorkspace: (ws: Workspace) => void;
  createWorkspace: (name: string) => Promise<Workspace>;
  joinWorkspace: (code: string) => Promise<Workspace>;
}

interface AttendanceSlice {
  todayRecord: AttendanceRecord | null;
  history: AttendanceRecord[];
  clockIn: (method: "gps" | "wifi" | "qr", lat?: number, lng?: number) => Promise<AttendanceRecord>;
  clockOut: (method: "gps" | "wifi" | "qr", lat?: number, lng?: number) => Promise<AttendanceRecord>;
  loadHistory: () => Promise<void>;
}

interface LeaveSlice {
  balance: LeaveBalance | null;
  requests: LeaveRequest[];
  submitLeave: (req: Omit<LeaveRequest, "id" | "workspace_id" | "user_id" | "status" | "created_at">) => Promise<void>;
}

interface NotificationSlice {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
}

type Store = AuthSlice & WorkspaceSlice & AttendanceSlice & LeaveSlice & NotificationSlice;

export const useStore = create<Store>((set, get) => ({
  // ── Auth ───────────────────────────────────────────────
  user: null,
  isAuthenticated: false,

  signIn: async (_email, _otp) => {
    // Fake: any OTP works in dev
    await new Promise((r) => setTimeout(r, 800));
    set({
      user: SEED_USER,
      isAuthenticated: true,
      workspace: SEED_WORKSPACE,
      members: SEED_MEMBERS,
      todayRecord: SEED_ATTENDANCE_TODAY,
      history: SEED_ATTENDANCE_HISTORY,
      balance: SEED_LEAVE_BALANCE,
      requests: SEED_LEAVE_REQUESTS,
      notifications: SEED_NOTIFICATIONS,
      unreadCount: SEED_NOTIFICATIONS.filter((n) => !n.is_read).length,
    });
  },

  signOut: () =>
    set({
      user: null,
      isAuthenticated: false,
      workspace: null,
      members: [],
      todayRecord: null,
      history: [],
      balance: null,
      requests: [],
      notifications: [],
      unreadCount: 0,
    }),

  // ── Workspace ──────────────────────────────────────────
  workspace: null,
  members: [],

  setWorkspace: (ws) => set({ workspace: ws }),

  createWorkspace: async (name) => {
    await new Promise((r) => setTimeout(r, 600));
    const ws: Workspace = {
      id: `ws-${Date.now()}`,
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      owner_id: get().user?.id ?? "",
      timezone: "Asia/Ho_Chi_Minh",
      invite_code: Math.random().toString(36).slice(2, 10).toUpperCase(),
      created_at: new Date().toISOString(),
    };
    set({ workspace: ws });
    return ws;
  },

  joinWorkspace: async (code) => {
    await new Promise((r) => setTimeout(r, 600));
    if (code !== SEED_WORKSPACE.invite_code && code !== "TEST") {
      throw new Error("Mã mời không hợp lệ hoặc đã hết hạn.");
    }
    set({ workspace: SEED_WORKSPACE, members: SEED_MEMBERS });
    return SEED_WORKSPACE;
  },

  // ── Attendance ─────────────────────────────────────────
  todayRecord: null,
  history: [],

  clockIn: async (method, lat, lng) => {
    await new Promise((r) => setTimeout(r, 1200));
    const record: AttendanceRecord = {
      id: `ar-${Date.now()}`,
      workspace_id: get().workspace?.id ?? "",
      user_id: get().user?.id ?? "",
      date: new Date().toISOString().slice(0, 10),
      clock_in_at: new Date().toISOString(),
      clock_in_method: method,
      clock_in_lat: lat,
      clock_in_lng: lng,
      status: "on-time",
      idempotency_key: crypto.randomUUID(),
    };
    set({ todayRecord: record });
    return record;
  },

  clockOut: async (method, lat, lng) => {
    await new Promise((r) => setTimeout(r, 1200));
    const existing = get().todayRecord;
    if (!existing) throw new Error("Chưa chấm công vào hôm nay.");
    const inAt = new Date(existing.clock_in_at!);
    const outAt = new Date();
    const worked = Math.round((outAt.getTime() - inAt.getTime()) / 60000);
    const updated: AttendanceRecord = {
      ...existing,
      clock_out_at: outAt.toISOString(),
      clock_out_method: method,
      clock_out_lat: lat,
      clock_out_lng: lng,
      worked_minutes: worked,
    };
    set({ todayRecord: updated });
    return updated;
  },

  loadHistory: async () => {
    await new Promise((r) => setTimeout(r, 400));
    set({ history: SEED_ATTENDANCE_HISTORY });
  },

  // ── Leave ──────────────────────────────────────────────
  balance: null,
  requests: [],

  submitLeave: async (req) => {
    await new Promise((r) => setTimeout(r, 800));
    const newReq: LeaveRequest = {
      ...req,
      id: `lr-${Date.now()}`,
      workspace_id: get().workspace?.id ?? "",
      user_id: get().user?.id ?? "",
      status: "pending",
      created_at: new Date().toISOString(),
    };
    set((s) => ({ requests: [newReq, ...s.requests] }));
  },

  // ── Notifications ──────────────────────────────────────
  notifications: [],
  unreadCount: 0,

  markRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) =>
        n.id === id ? { ...n, is_read: true } : n
      ),
      unreadCount: Math.max(0, s.unreadCount - 1),
    })),

  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, is_read: true })),
      unreadCount: 0,
    })),
}));
