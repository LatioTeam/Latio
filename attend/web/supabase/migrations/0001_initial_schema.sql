-- Migration: 0001_initial_schema
-- LATIO Chấm Công — Milestone 0 tables
-- Chạy: psql $DATABASE_URL -f supabase/migrations/0001_initial_schema.sql
-- Hoặc: npx drizzle-kit push

-- ── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE workspace_role   AS ENUM ('owner', 'admin', 'manager', 'member');
CREATE TYPE checkin_method   AS ENUM ('gps', 'wifi', 'qr', 'manual');
CREATE TYPE attendance_status AS ENUM ('on-time', 'late', 'absent', 'leave', 'ot');
CREATE TYPE leave_type       AS ENUM ('annual', 'sick', 'unpaid', 'other');
CREATE TYPE leave_status     AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
CREATE TYPE payroll_status   AS ENUM ('calculating', 'ready', 'exported');

-- ── workspaces ───────────────────────────────────────────────────────────────

CREATE TABLE workspaces (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  slug         VARCHAR(50)  NOT NULL UNIQUE,
  owner_id     UUID         NOT NULL REFERENCES auth.users(id),
  timezone     VARCHAR(50)  NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  invite_code  VARCHAR(12)  NOT NULL UNIQUE,
  logo_url     TEXT,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX workspaces_owner_idx ON workspaces(owner_id);

-- ── workspace_members ────────────────────────────────────────────────────────

CREATE TABLE workspace_members (
  id             UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id   UUID         NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id        UUID         NOT NULL REFERENCES auth.users(id),
  role           workspace_role NOT NULL DEFAULT 'member',
  employee_code  VARCHAR(20),
  department     VARCHAR(100),
  position       VARCHAR(100),
  base_salary    BIGINT,       -- VND in cents
  joined_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  is_active      BOOLEAN      NOT NULL DEFAULT TRUE,
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX workspace_members_workspace_idx ON workspace_members(workspace_id);
CREATE INDEX workspace_members_user_idx ON workspace_members(user_id);

-- ── shifts ───────────────────────────────────────────────────────────────────

CREATE TABLE shifts (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id        UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name                VARCHAR(100) NOT NULL,
  start_time          VARCHAR(5)  NOT NULL,   -- "08:30"
  end_time            VARCHAR(5)  NOT NULL,   -- "17:30"
  break_minutes       INTEGER     NOT NULL DEFAULT 60,
  color               VARCHAR(7)  NOT NULL DEFAULT '#1e4fd4',
  is_overnight        BOOLEAN     NOT NULL DEFAULT FALSE,
  work_days           INTEGER[]   NOT NULL DEFAULT '{1,2,3,4,5}',
  late_threshold_min  INTEGER     NOT NULL DEFAULT 15,
  ot_start_min        INTEGER     NOT NULL DEFAULT 30,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── checkin_rules ─────────────────────────────────────────────────────────────

CREATE TABLE checkin_rules (
  id                      UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id            UUID     NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE UNIQUE,
  gps_enabled             BOOLEAN  NOT NULL DEFAULT TRUE,
  gps_lat                 REAL,
  gps_lng                 REAL,
  gps_radius_m            INTEGER  NOT NULL DEFAULT 150,
  wifi_enabled            BOOLEAN  NOT NULL DEFAULT TRUE,
  wifi_ssids              TEXT[]   DEFAULT '{}',
  qr_enabled              BOOLEAN  NOT NULL DEFAULT TRUE,
  qr_secret               TEXT,
  late_threshold_minutes  INTEGER  NOT NULL DEFAULT 10,
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── attendance_records ────────────────────────────────────────────────────────

CREATE TABLE attendance_records (
  id                UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      UUID            NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id           UUID            NOT NULL REFERENCES auth.users(id),
  date              VARCHAR(10)     NOT NULL,     -- "2026-11-17"
  clock_in_at       TIMESTAMPTZ,
  clock_out_at      TIMESTAMPTZ,
  clock_in_method   checkin_method,
  clock_out_method  checkin_method,
  clock_in_lat      REAL,
  clock_in_lng      REAL,
  clock_out_lat     REAL,
  clock_out_lng     REAL,
  worked_minutes    INTEGER,
  status            attendance_status NOT NULL DEFAULT 'absent',
  note              TEXT,
  is_flagged        BOOLEAN         NOT NULL DEFAULT FALSE,
  idempotency_key   UUID            UNIQUE,       -- offline sync dedup
  created_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)             -- race condition prevention
);

CREATE INDEX attendance_records_workspace_date_idx ON attendance_records(workspace_id, date);
CREATE INDEX attendance_records_user_date_idx ON attendance_records(user_id, date);

-- ── leave_requests ────────────────────────────────────────────────────────────

CREATE TABLE leave_requests (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID         NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id         UUID         NOT NULL REFERENCES auth.users(id),
  leave_type      leave_type   NOT NULL,
  start_date      VARCHAR(10)  NOT NULL,
  end_date        VARCHAR(10)  NOT NULL,
  is_half_day     BOOLEAN      NOT NULL DEFAULT FALSE,
  half_day_period VARCHAR(9),  -- 'morning' | 'afternoon'
  reason          TEXT         NOT NULL,
  status          leave_status NOT NULL DEFAULT 'pending',
  reviewer_id     UUID         REFERENCES auth.users(id),
  reviewer_note   TEXT,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX leave_requests_workspace_user_idx ON leave_requests(workspace_id, user_id);
CREATE INDEX leave_requests_status_idx ON leave_requests(status);

-- ── leave_balances ────────────────────────────────────────────────────────────

CREATE TABLE leave_balances (
  id            UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID     NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID     NOT NULL REFERENCES auth.users(id),
  year          SMALLINT NOT NULL,
  annual_days   REAL     NOT NULL DEFAULT 12,
  annual_used   REAL     NOT NULL DEFAULT 0,
  sick_days     REAL     NOT NULL DEFAULT 5,
  sick_used     REAL     NOT NULL DEFAULT 0,
  UNIQUE(user_id, year)
);

-- ── notifications ─────────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  UUID        NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id       UUID        NOT NULL REFERENCES auth.users(id),
  type          VARCHAR(50) NOT NULL,
  title         VARCHAR(200) NOT NULL,
  body          TEXT        NOT NULL,
  reference_id  UUID,
  is_read       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX notifications_user_read_idx ON notifications(user_id, is_read);

-- ── updated_at triggers ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER workspaces_updated_at
  BEFORE UPDATE ON workspaces
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER workspace_members_updated_at
  BEFORE UPDATE ON workspace_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER attendance_records_updated_at
  BEFORE UPDATE ON attendance_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER leave_requests_updated_at
  BEFORE UPDATE ON leave_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
