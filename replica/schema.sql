-- LATIO Attendance App — Database Schema
-- Database: PostgreSQL on Supabase
-- Convention: uuid PK, timestamptz UTC, money as integer VND cents
-- RLS: enabled on all tables, policies defined per table
-- Generated: 2026-11-16

-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- WORKSPACES
-- ============================================================
create table workspaces (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  industry    text,
  timezone    text not null default 'Asia/Ho_Chi_Minh',
  logo_url    text,
  invite_code text unique default upper(substring(encode(gen_random_bytes(4), 'hex'), 1, 8)),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index on workspaces (invite_code);

alter table workspaces enable row level security;
-- Policy: chỉ members của workspace mới xem được
create policy "members can view their workspace"
  on workspaces for select
  using (
    exists (
      select 1 from workspace_members
      where workspace_id = workspaces.id
        and user_id = auth.uid()
        and status = 'active'
    )
  );

-- ============================================================
-- WORKSPACE MEMBERS (users ↔ workspaces)
-- ============================================================
create table workspace_members (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null default 'employee'
                 check (role in ('owner', 'manager', 'employee')),
  full_name    text not null,
  phone        text,
  email        text,
  avatar_url   text,
  employee_id  text,                       -- mã nhân viên nội bộ
  dob          date,
  address      text,
  emergency_contact jsonb default '{}',   -- {name, phone, relation}
  department   text,
  hire_date    date,
  status       text not null default 'active'
                 check (status in ('active', 'inactive')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index on workspace_members (workspace_id, status);
create index on workspace_members (user_id);
create index on workspace_members (workspace_id, role);

alter table workspace_members enable row level security;

create policy "members can view coworkers"
  on workspace_members for select
  using (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and status = 'active'
    )
  );

create policy "managers can update members"
  on workspace_members for update
  using (
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid()
        and role in ('owner', 'manager')
        and status = 'active'
    )
  );

-- ============================================================
-- SHIFTS (templates ca làm việc)
-- ============================================================
create table shifts (
  id                  uuid primary key default gen_random_uuid(),
  workspace_id        uuid not null references workspaces(id) on delete cascade,
  name                text not null,
  color               text not null default '#3B82F6',   -- hex color
  start_time          time not null,                     -- giờ bắt đầu (local)
  end_time            time not null,                     -- giờ kết thúc (local)
  is_overnight        boolean not null default false,    -- ca qua đêm
  days_of_week        int[] not null default '{1,2,3,4,5}',  -- 0=CN, 1=T2...
  break_duration_min  int not null default 60,
  late_grace_min      int not null default 15,           -- trễ bao nhiêu phút mới bị late
  allowance_vnd       bigint not null default 0,         -- phụ cấp ca, đơn vị VND
  is_active           boolean not null default true,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index on shifts (workspace_id, is_active);

alter table shifts enable row level security;
create policy "members can view shifts" on shifts for select
  using (workspace_id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and status = 'active'
  ));

-- ============================================================
-- SHIFT ASSIGNMENTS (phân ca theo ngày)
-- ============================================================
create table shift_assignments (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  shift_id     uuid not null references shifts(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  date         date not null,
  status       text not null default 'scheduled'
                 check (status in ('scheduled', 'swapped', 'cancelled')),
  note         text,
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (user_id, date, shift_id)              -- không được 2 ca giống nhau cùng ngày
);

create index on shift_assignments (workspace_id, date);
create index on shift_assignments (user_id, date);
create index on shift_assignments (shift_id);

alter table shift_assignments enable row level security;
create policy "members view own assignments" on shift_assignments for select
  using (user_id = auth.uid() or workspace_id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and role in ('owner','manager') and status = 'active'
  ));

-- ============================================================
-- ATTENDANCE RECORDS (bản ghi chấm công)
-- ============================================================
create table attendance_records (
  id                   uuid primary key default gen_random_uuid(),
  idempotency_key      uuid unique,                      -- offline sync dedup
  workspace_id         uuid not null references workspaces(id) on delete cascade,
  user_id              uuid not null references auth.users(id) on delete cascade,
  shift_assignment_id  uuid references shift_assignments(id) on delete set null,
  date                 date not null,

  clock_in_at          timestamptz,
  clock_in_method      text check (clock_in_method in ('gps','wifi','qr','photo','manual')),
  clock_in_lat         double precision,
  clock_in_lng         double precision,
  clock_in_accuracy_m  double precision,
  clock_in_wifi_ssid   text,
  clock_in_photo_url   text,

  clock_out_at         timestamptz,
  clock_out_method     text check (clock_out_method in ('gps','wifi','qr','photo','manual','auto')),
  clock_out_lat        double precision,
  clock_out_lng        double precision,
  clock_out_photo_url  text,

  worked_minutes       int generated always as (
    case when clock_out_at is not null and clock_in_at is not null
    then extract(epoch from (clock_out_at - clock_in_at))::int / 60
    else null end
  ) stored,

  is_late              boolean not null default false,
  late_minutes         int not null default 0,
  is_early_out         boolean not null default false,

  notes                text,
  status               text not null default 'pending'
                         check (status in ('pending', 'approved', 'adjusted', 'flagged')),
  adjusted_by          uuid references auth.users(id),
  adjusted_at          timestamptz,
  adjust_reason        text,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),

  -- không thể check-in 2 lần cùng ngày cùng user (1 record active per day)
  unique (user_id, date)
);

create index on attendance_records (workspace_id, date);
create index on attendance_records (user_id, date);
create index on attendance_records (workspace_id, status);
create index on attendance_records (shift_assignment_id);

alter table attendance_records enable row level security;
create policy "employees view own records" on attendance_records for select
  using (user_id = auth.uid() or workspace_id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and role in ('owner','manager') and status = 'active'
  ));
create policy "employees insert own records" on attendance_records for insert
  with check (user_id = auth.uid());

-- ============================================================
-- LEAVE REQUESTS
-- ============================================================
create table leave_requests (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid not null references workspaces(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  leave_type        text not null
                      check (leave_type in ('annual', 'sick', 'unpaid', 'other')),
  start_date        date not null,
  end_date          date not null,
  is_half_day       boolean not null default false,
  half_day_period   text check (half_day_period in ('morning', 'afternoon')),
  hours             numeric(4,2),                   -- nullable: chỉ cho hourly leave
  total_days        numeric(5,2) not null,          -- tính toán và lưu lại
  reason            text,
  status            text not null default 'pending'
                      check (status in ('draft', 'pending', 'approved', 'rejected', 'cancelled')),
  reviewed_by       uuid references auth.users(id),
  review_note       text,
  reviewed_at       timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  constraint valid_date_range check (end_date >= start_date),
  constraint half_day_needs_period check (
    not is_half_day or half_day_period is not null
  )
);

create index on leave_requests (workspace_id, status);
create index on leave_requests (user_id, start_date);
create index on leave_requests (reviewed_by);

alter table leave_requests enable row level security;
create policy "employees view own leave" on leave_requests for select
  using (user_id = auth.uid() or workspace_id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and role in ('owner','manager') and status = 'active'
  ));
create policy "employees submit own leave" on leave_requests for insert
  with check (user_id = auth.uid());

-- ============================================================
-- LEAVE BALANCES (số ngày phép còn lại theo năm)
-- ============================================================
create table leave_balances (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  year         int not null,
  leave_type   text not null check (leave_type in ('annual', 'sick')),
  total_days   numeric(5,2) not null default 12,
  used_days    numeric(5,2) not null default 0,
  remaining    numeric(5,2) generated always as (total_days - used_days) stored,
  updated_at   timestamptz not null default now(),
  unique (workspace_id, user_id, year, leave_type)
);

create index on leave_balances (workspace_id, user_id, year);

alter table leave_balances enable row level security;
create policy "members view own balance" on leave_balances for select
  using (user_id = auth.uid() or workspace_id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and role in ('owner','manager') and status = 'active'
  ));

-- ============================================================
-- OVERTIME REQUESTS
-- ============================================================
create table overtime_requests (
  id              uuid primary key default gen_random_uuid(),
  workspace_id    uuid not null references workspaces(id) on delete cascade,
  user_id         uuid not null references auth.users(id) on delete cascade,
  date            date not null,
  hours           numeric(4,2) not null check (hours > 0 and hours <= 24),
  reason          text,
  status          text not null default 'pending'
                    check (status in ('pending', 'approved', 'rejected', 'cancelled')),
  reviewed_by     uuid references auth.users(id),
  review_note     text,
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index on overtime_requests (workspace_id, status);
create index on overtime_requests (user_id, date);

alter table overtime_requests enable row level security;
create policy "employees view own ot" on overtime_requests for select
  using (user_id = auth.uid() or workspace_id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and role in ('owner','manager') and status = 'active'
  ));

-- ============================================================
-- SALARY CONFIGS
-- ============================================================
create table salary_configs (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid not null references workspaces(id) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  effective_from   date not null,
  base_type        text not null check (base_type in ('monthly', 'daily', 'hourly')),
  base_amount_vnd  bigint not null check (base_amount_vnd >= 0),  -- VND
  ot_multiplier    numeric(3,2) not null default 1.5,
  allowances       jsonb not null default '[]',   -- [{name, amount_vnd, type: fixed|per_shift}]
  deductions       jsonb not null default '[]',   -- [{name, amount_vnd, type: fixed|percent}]
  created_by       uuid references auth.users(id),
  created_at       timestamptz not null default now()
);

create index on salary_configs (workspace_id, user_id, effective_from desc);

alter table salary_configs enable row level security;
create policy "managers view salary configs" on salary_configs for select
  using (
    user_id = auth.uid() or
    workspace_id in (
      select workspace_id from workspace_members
      where user_id = auth.uid() and role in ('owner','manager') and status = 'active'
    )
  );

-- ============================================================
-- PAYROLL RECORDS
-- ============================================================
create table payroll_records (
  id                uuid primary key default gen_random_uuid(),
  workspace_id      uuid not null references workspaces(id) on delete cascade,
  user_id           uuid not null references auth.users(id) on delete cascade,
  period_month      int not null check (period_month between 1 and 12),
  period_year       int not null check (period_year > 2020),

  -- số liệu từ attendance
  working_days      int not null default 0,       -- số ngày theo lịch
  actual_days       numeric(5,2) not null default 0,  -- ngày thực tế làm
  leave_days_paid   numeric(5,2) not null default 0,
  leave_days_unpaid numeric(5,2) not null default 0,
  late_count        int not null default 0,
  ot_hours          numeric(6,2) not null default 0,

  -- tiền (đơn vị VND)
  base_salary_vnd        bigint not null default 0,
  allowances_total_vnd   bigint not null default 0,
  deductions_total_vnd   bigint not null default 0,
  ot_pay_vnd             bigint not null default 0,
  advance_vnd            bigint not null default 0,
  net_salary_vnd         bigint not null default 0,

  breakdown              jsonb not null default '{}',  -- chi tiết tính toán
  status                 text not null default 'calculating'
                           check (status in ('calculating', 'ready', 'confirmed', 'exported')),
  calculated_at          timestamptz,
  confirmed_by           uuid references auth.users(id),
  confirmed_at           timestamptz,
  exported_at            timestamptz,
  export_url             text,                         -- URL file đã export

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  unique (workspace_id, user_id, period_month, period_year)
);

create index on payroll_records (workspace_id, period_year, period_month);
create index on payroll_records (user_id, period_year, period_month);
create index on payroll_records (workspace_id, status);

alter table payroll_records enable row level security;
create policy "employees view own payroll" on payroll_records for select
  using (user_id = auth.uid() or workspace_id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and role in ('owner','manager') and status = 'active'
  ));

-- ============================================================
-- CHECKIN RULES
-- ============================================================
create table checkin_rules (
  id                   uuid primary key default gen_random_uuid(),
  workspace_id         uuid not null unique references workspaces(id) on delete cascade,
  allowed_methods      text[] not null default '{gps,wifi,qr}',
  gps_lat              double precision,
  gps_lng              double precision,
  gps_radius_m         int not null default 200,
  wifi_ssids           text[] not null default '{}',
  qr_secret            text default encode(gen_random_bytes(16), 'hex'),
  qr_expires_minutes   int not null default 10,       -- QR code hết hạn sau N phút
  require_photo        boolean not null default false,
  auto_checkout        boolean not null default false,
  auto_penalty_minutes int not null default 0,        -- trừ N phút nếu quên check-out
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

alter table checkin_rules enable row level security;
create policy "members view checkin rules" on checkin_rules for select
  using (workspace_id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and status = 'active'
  ));

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table notifications (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid references workspaces(id) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  type             text not null,                      -- shift_reminder, leave_approved, payroll_ready, ...
  title            text not null,
  body             text not null,
  reference_type   text,                               -- leave_request, attendance_record, ...
  reference_id     uuid,
  is_read          boolean not null default false,
  push_sent        boolean not null default false,
  created_at       timestamptz not null default now()
);

create index on notifications (user_id, is_read, created_at desc);
create index on notifications (workspace_id);

alter table notifications enable row level security;
create policy "users view own notifications" on notifications for select
  using (user_id = auth.uid());
create policy "users update own notifications" on notifications for update
  using (user_id = auth.uid());

-- ============================================================
-- PROJECTS (LATIO-specific: agency billing)
-- ============================================================
create table projects (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  name         text not null,
  client_name  text,
  color        text not null default '#10B981',
  code         text,                                   -- mã project
  status       text not null default 'active'
                 check (status in ('active', 'completed', 'paused')),
  budget_hours numeric(8,2),
  created_by   uuid references auth.users(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index on projects (workspace_id, status);

alter table projects enable row level security;
create policy "members view projects" on projects for select
  using (workspace_id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and status = 'active'
  ));

-- ============================================================
-- PROJECT TIMESHEETS (LATIO-specific: giờ làm theo project)
-- ============================================================
create table project_timesheets (
  id                   uuid primary key default gen_random_uuid(),
  workspace_id         uuid not null references workspaces(id) on delete cascade,
  project_id           uuid not null references projects(id) on delete cascade,
  user_id              uuid not null references auth.users(id) on delete cascade,
  attendance_record_id uuid references attendance_records(id) on delete set null,
  date                 date not null,
  hours                numeric(5,2) not null check (hours > 0),
  description          text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index on project_timesheets (project_id, date);
create index on project_timesheets (user_id, date);
create index on project_timesheets (workspace_id, date);

alter table project_timesheets enable row level security;
create policy "members view timesheets" on project_timesheets for select
  using (workspace_id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and status = 'active'
  ));

-- ============================================================
-- AUDIT LOG (không xóa được)
-- ============================================================
create table audit_logs (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id),
  actor_id     uuid references auth.users(id),
  action       text not null,                -- e.g. 'attendance.adjusted', 'member.deleted'
  target_type  text,
  target_id    uuid,
  old_data     jsonb,
  new_data     jsonb,
  ip_address   text,
  created_at   timestamptz not null default now()
);

create index on audit_logs (workspace_id, created_at desc);
create index on audit_logs (actor_id);

-- Audit log chỉ insert, không update/delete
alter table audit_logs enable row level security;
create policy "managers view audit logs" on audit_logs for select
  using (workspace_id in (
    select workspace_id from workspace_members
    where user_id = auth.uid() and role in ('owner','manager') and status = 'active'
  ));

-- ============================================================
-- TRIGGERS: updated_at tự động
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger workspaces_updated_at before update on workspaces
  for each row execute function set_updated_at();
create trigger workspace_members_updated_at before update on workspace_members
  for each row execute function set_updated_at();
create trigger shifts_updated_at before update on shifts
  for each row execute function set_updated_at();
create trigger shift_assignments_updated_at before update on shift_assignments
  for each row execute function set_updated_at();
create trigger attendance_records_updated_at before update on attendance_records
  for each row execute function set_updated_at();
create trigger leave_requests_updated_at before update on leave_requests
  for each row execute function set_updated_at();
create trigger overtime_requests_updated_at before update on overtime_requests
  for each row execute function set_updated_at();
create trigger payroll_records_updated_at before update on payroll_records
  for each row execute function set_updated_at();
create trigger checkin_rules_updated_at before update on checkin_rules
  for each row execute function set_updated_at();
create trigger projects_updated_at before update on projects
  for each row execute function set_updated_at();
create trigger project_timesheets_updated_at before update on project_timesheets
  for each row execute function set_updated_at();
