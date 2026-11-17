-- Migration: 0002_rls_policies
-- Row Level Security — mọi table đều bật RLS
-- Quy tắc: user chỉ thấy data của workspace họ là thành viên

-- Helper function: lấy workspace_id list của user hiện tại
CREATE OR REPLACE FUNCTION get_user_workspace_ids()
RETURNS UUID[] AS $$
  SELECT ARRAY_AGG(workspace_id)
  FROM workspace_members
  WHERE user_id = auth.uid() AND is_active = TRUE
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: kiểm tra user có phải manager+ trong workspace không
CREATE OR REPLACE FUNCTION is_manager_in_workspace(ws_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin', 'manager')
      AND is_active = TRUE
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ── workspaces ───────────────────────────────────────────────────────────────

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Members thấy workspace của họ
CREATE POLICY "workspaces_select" ON workspaces
  FOR SELECT USING (id = ANY(get_user_workspace_ids()));

-- Authenticated users tạo workspace
CREATE POLICY "workspaces_insert" ON workspaces
  FOR INSERT WITH CHECK (owner_id = auth.uid());

-- Chỉ owner/manager update
CREATE POLICY "workspaces_update" ON workspaces
  FOR UPDATE USING (is_manager_in_workspace(id));

-- ── workspace_members ────────────────────────────────────────────────────────

ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Members thấy các thành viên khác trong workspace của họ
CREATE POLICY "workspace_members_select" ON workspace_members
  FOR SELECT USING (workspace_id = ANY(get_user_workspace_ids()));

-- Manager thêm thành viên
CREATE POLICY "workspace_members_insert" ON workspace_members
  FOR INSERT WITH CHECK (is_manager_in_workspace(workspace_id) OR user_id = auth.uid());

-- Manager update thành viên; user update chính họ
CREATE POLICY "workspace_members_update" ON workspace_members
  FOR UPDATE USING (is_manager_in_workspace(workspace_id) OR user_id = auth.uid());

-- ── shifts ───────────────────────────────────────────────────────────────────

ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shifts_select" ON shifts
  FOR SELECT USING (workspace_id = ANY(get_user_workspace_ids()));

CREATE POLICY "shifts_insert" ON shifts
  FOR INSERT WITH CHECK (is_manager_in_workspace(workspace_id));

CREATE POLICY "shifts_update" ON shifts
  FOR UPDATE USING (is_manager_in_workspace(workspace_id));

CREATE POLICY "shifts_delete" ON shifts
  FOR DELETE USING (is_manager_in_workspace(workspace_id));

-- ── checkin_rules ─────────────────────────────────────────────────────────────

ALTER TABLE checkin_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "checkin_rules_select" ON checkin_rules
  FOR SELECT USING (workspace_id = ANY(get_user_workspace_ids()));

CREATE POLICY "checkin_rules_insert" ON checkin_rules
  FOR INSERT WITH CHECK (is_manager_in_workspace(workspace_id));

CREATE POLICY "checkin_rules_update" ON checkin_rules
  FOR UPDATE USING (is_manager_in_workspace(workspace_id));

-- ── attendance_records ────────────────────────────────────────────────────────

ALTER TABLE attendance_records ENABLE ROW LEVEL SECURITY;

-- Nhân viên xem records của chính họ
CREATE POLICY "attendance_own_select" ON attendance_records
  FOR SELECT USING (user_id = auth.uid());

-- Manager xem tất cả trong workspace
CREATE POLICY "attendance_manager_select" ON attendance_records
  FOR SELECT USING (is_manager_in_workspace(workspace_id));

-- Nhân viên insert record của chính họ
CREATE POLICY "attendance_insert" ON attendance_records
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND workspace_id = ANY(get_user_workspace_ids())
  );

-- Nhân viên update record của chính họ (clock-out); Manager update tất cả
CREATE POLICY "attendance_own_update" ON attendance_records
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "attendance_manager_update" ON attendance_records
  FOR UPDATE USING (is_manager_in_workspace(workspace_id));

-- ── leave_requests ────────────────────────────────────────────────────────────

ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leave_own_select" ON leave_requests
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "leave_manager_select" ON leave_requests
  FOR SELECT USING (is_manager_in_workspace(workspace_id));

CREATE POLICY "leave_insert" ON leave_requests
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND workspace_id = ANY(get_user_workspace_ids())
  );

-- Nhân viên huỷ đơn pending của họ; Manager duyệt/từ chối
CREATE POLICY "leave_own_update" ON leave_requests
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "leave_manager_update" ON leave_requests
  FOR UPDATE USING (is_manager_in_workspace(workspace_id));

-- ── leave_balances ────────────────────────────────────────────────────────────

ALTER TABLE leave_balances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "leave_balance_own_select" ON leave_balances
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "leave_balance_manager_select" ON leave_balances
  FOR SELECT USING (is_manager_in_workspace(workspace_id));

CREATE POLICY "leave_balance_manager_write" ON leave_balances
  FOR ALL USING (is_manager_in_workspace(workspace_id));

-- ── notifications ─────────────────────────────────────────────────────────────

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users chỉ thấy notifications của chính họ
CREATE POLICY "notifications_select" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "notifications_update" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Service role insert (server-side only via service key)
CREATE POLICY "notifications_insert_service" ON notifications
  FOR INSERT WITH CHECK (workspace_id = ANY(get_user_workspace_ids()));

-- ── Realtime Subscriptions ────────────────────────────────────────────────────
-- Cho phép manager subscribe vào attendance_records table (admin dashboard)
ALTER PUBLICATION supabase_realtime ADD TABLE attendance_records;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
