# Component Specs — LATIO Attendance App
> Source: replica/recon.md component list
> Stack: Expo (React Native) + Next.js — use shadcn/ui (web) + NativeWind (mobile)
> Icons: Lucide React / lucide-react-native (MIT)
> Date: 2026-11-16

---

## Primitives (build these first, in isolation)

---

### Button

```
variants   primary | secondary | ghost | danger | success
sizes      sm 32px | md 40px | lg 48px
states     default | hover | active | focus-visible | disabled | loading

primary
  bg accent, text on-accent, hover bg accent-hover
  radius pill, font sm/600, px 4 py 2
  focus-visible ring 2px border-focus offset 2px

secondary
  bg surface, text text, border border
  hover bg surface border-input

ghost
  bg transparent, text accent
  hover bg accent-subtle

danger
  bg danger, text on-danger

disabled
  opacity 40%, cursor not-allowed, pointer-events none

loading
  spinner replaces icon (left slot), label stays visible for screen readers
  aria-busy true, aria-disabled true

a11y   real <button> element (never <div>), type="button" unless submit
       loading keeps label text so screen readers announce it
       focus ring always visible (not hidden on mouse use)

tokens bg accent | text on-accent | radius pill | font sm/600
used on S02 (login), S06/S07 (clock in/out), S10 (submit leave), S20 (approve)
```

---

### ClockButton
> The main action — the largest tap target in the app

```
variants   clock-in (green) | clock-out (red)
size       96px diameter circle (mobile), 120px tablet
states     idle | verifying (spinner) | success (checkmark, 1s) | error (shake)

clock-in   bg checkin (#15803d), icon: LogIn, label "Chấm công vào"
clock-out  bg checkout (#b91c1c), icon: LogOut, label "Chấm công ra"

verifying  bg-color stays, center spinner, label "Đang xác minh..."
success    bg-color → 60% opacity, check icon, haptic feedback (mobile)
error      shake animation (spring ease, 3 cycles 300ms), bg danger-bg

a11y   role button, aria-label "Chấm công vào — đang chờ xác minh GPS"
       announce result to screen reader via live region
       minimum 48×48px touch target (iOS HIG)

tokens bg checkin/checkout | radius pill | shadow pop | font md/700
used on S05 (home), S06, S07
```

---

### StatusBadge

```
variants   on-time | late | absent | leave | ot | pending | approved | rejected

on-time    bg success-bg, text success, icon CheckCircle
late       bg warning-bg, text warning, icon Clock
absent     bg surface, text absent, icon XCircle
leave      bg #ede9fe, text leave (#6d28d9), icon CalendarOff
ot         bg info-bg, text info, icon TrendingUp
pending    bg warning-bg, text warning, icon Clock
approved   bg success-bg, text success, icon CheckCircle
rejected   bg danger-bg, text danger, icon XCircle

size   xs: 20px height, pill radius, font xs/500, px 2
       md: 24px height (admin tables)

a11y   span with role="status", text includes both icon meaning and label
       e.g. "Trạng thái: Đi muộn 15 phút"

tokens font xs/500 | radius pill | padding px-2 py-0.5
used on S05, S08, S15, S16, S19, S20, S22
```

---

### ShiftCard

```
variants   employee-view | admin-view
states     normal | overnight | conflict | cancelled

employee-view
  bg surface-raised, border-l 3px solid shift.color
  top: shift name + time range
  bottom: break duration, allowance (if any)
  size: full-width, 72px height

admin-view
  same + drag handle (GripVertical icon, right edge)
  conflict: border danger, background danger-bg tint
  cancelled: opacity 40%, strikethrough on name

overnight
  MoonStar icon after time, e.g. "22:00 → 06:00 ☽"

a11y   role="article", aria-label includes name, time, date
       drag handle: role="button", aria-grabbed, keyboard arrow keys to move

tokens bg surface-raised | border-l 3px | radius md | shadow xs
used on S09, S18
```

---

### AttendanceCalendar

```
variants   monthly | weekly
states     loading | empty | filled | range-select (leave picker)

monthly
  7-col grid, day cells 48×48px (desktop), 40px (mobile)
  each cell: date number top-right, status dot bottom center
  status dot colors: checkin green, late orange, absent gray, leave purple
  today: ring 1.5px accent
  selected: bg accent-subtle, ring accent
  future: text-subtle, no dot

weekly
  horizontal scroll, 7 columns
  taller cells (96px) show time ranges as colored bars
  used for shift schedule (S09)

range-select (leave picker on S10)
  start/end date highlighted, range bg accent-subtle
  taps set start then end; can tap same day for single day

a11y   role="grid", cells role="gridcell", aria-selected
       arrow key navigation between cells
       screen reader: "Thứ Hai 10 tháng 11 — Đi muộn 20 phút"

tokens bg surface-raised | radius card | shadow card
used on S08, S09, S10, S19
```

---

### BottomNavBar

```
tabs    Home (House) | History (ClockHistory) | Schedule (Calendar) | Profile (User)
height  64px (--bottom-nav-height), safe-area-inset-bottom aware
bg      bg with border-top border

active tab   icon + label text accent, indicator 2px top bar accent
inactive     icon + label text-subtle, no label animation
badge        unread count on bell/notifications (outside the 4 tabs but same bar in some screens)

a11y   role="navigation" aria-label="Điều hướng chính"
       each item role="link" aria-current="page" when active
       minimum 44px touch target per item

tokens bg bg | border-top border | font xs/500
used on S05–S14 (all employee screens)
```

---

### MapGeofence

```
states   locating | inside | outside | offline

map      react-native-maps (mobile), Mapbox GL (web admin)
circle   center: workspace GPS coords, radius: checkin_rules.gps_radius_m
         stroke: success (inside) or danger (outside)
         fill: 10% opacity of stroke color

user pin  blue dot (device location), pulsing when locating
accuracy  translucent ring = GPS accuracy radius

inside    "Trong vùng chấm công ✓" — text success
outside   "Ngoài vùng X mét" — text danger, distance shown
offline   "Không có kết nối mạng — sẽ đồng bộ sau" — text warning

a11y   announce location status via live region when it changes
       map has aria-label "Bản đồ vùng chấm công"
       status text always visible (not only as map overlay)

tokens radius md | shadow card
used on S06, S07, S23
```

---

### LeaveRequestForm

```
fields
  leave_type   SegmentedControl: Năm phép | Ốm | Không lương | Khác
  date range   AttendanceCalendar in range-select mode
  is_half_day  Toggle (shows/hides half_day_period)
  half_day     SegmentedControl: Sáng | Chiều (shown when is_half_day)
  hours        NumberInput (shown when leave_type = Khác and admin configured)
  reason       Textarea, placeholder "Lý do nghỉ phép…", maxLength 500

validation (inline, on blur)
  date range must be future (warn for today, block past)
  out of leave balance → warning badge "Còn X ngày phép" with red when 0

states   draft | submitting | submitted | error

a11y   form element, fieldset + legend per group
       error messages linked via aria-describedby
       success → focus moves to confirmation message

tokens font base | radius md | space-4 gap between fields
used on S10 (F02)
```

---

### PayrollSummaryCard

```
variants   employee (read-only) | admin (editable)

employee view
  month + year header, status badge (Đang tính | Sẵn sàng | Đã xuất)
  row: Ngày làm: X/Y ngày
  row: Ngày nghỉ phép: X ngày
  row: Giờ tăng ca: X giờ
  divider
  row bold: Lương net = X,XXX,XXX VND (formatted with commas)

admin view
  same + "Xuất Excel" and "Xuất PDF" buttons (ghost variant)
  "Duyệt bảng lương" CTA (primary) if status = ready

calculating state
  skeleton loaders on number rows, spinner on status badge

a11y   role="region" aria-label="Phiếu lương tháng X năm Y"
       numbers aria-label with full spoken form: "2.500.000 đồng"

tokens bg surface-raised | radius card | shadow card | p-4
used on S22 (F03, F06)
```

---

### ApprovalQueue

```
variants   leave | attendance-adjustment
states     empty | loading | has-items

each item
  left: EmployeeAvatar (sm) + name + request type badge
  center: summary (dates, duration, reason snippet)
  right: Approve (success ghost) + Reject (danger ghost) buttons
  expand: tap row → full detail bottom sheet

empty state
  icon CheckCircle2 (large, text-subtle)
  "Không có yêu cầu chờ duyệt"

batch actions (admin, top of list)
  "Duyệt tất cả X yêu cầu" — primary button
  shown only when queue has ≥ 2 items

a11y   role="list", each item role="listitem"
       approve button: aria-label "Duyệt nghỉ phép của Nguyễn Văn A từ 10/11"
       reject button: aria-label "Từ chối …"

tokens bg surface-raised | radius card | shadow card
used on S19, S20
```

---

### ExportModal

```
states   idle | exporting | success | error

idle
  title "Xuất bảng lương"
  format row: Excel (.xlsx) | PDF
  scope: tất cả nhân viên | chọn nhân viên (multi-select)
  period: tháng X năm Y (pre-filled)
  "Xuất" button (primary)

exporting
  progress bar (indeterminate), "Đang tạo file…"
  cancel button

success
  checkmark animation, "File đã sẵn sàng"
  "Tải xuống" (primary) + "Chia sẻ" (secondary)
  file size shown

error
  error message, "Thử lại" button

a11y   role="dialog" aria-modal="true" aria-labelledby
       focus trapped inside modal, ESC to close
       progress: role="progressbar" aria-valuenow

tokens shadow modal | radius lg | bg bg | p-6
used on S22, S24
```

---

### EmployeeAvatar

```
sizes   xs 24px | sm 32px | md 48px | lg 64px
variants  with-photo | initials-fallback | with-status-dot

with-photo      circular crop, object-fit cover
initials        2 chars (Nguyễn Văn A → "NA"), bg derived from name hash
                font size = 40% of avatar size, weight 600, text on-dark

status dot      8px circle, bottom-right, border 2px bg
                green = clocked-in today, gray = not yet, red = absent

a11y   role="img" aria-label="Ảnh đại diện của Nguyễn Văn A"
       status dot: aria-label added to parent context (not standalone)

tokens radius pill | border border | shadow xs
used on S14, S15, S16, S17, S20
```

---

### NotificationItem

```
variants   action-required | info
states     unread | read

unread    bg accent-subtle, left border 3px accent, font md/500
read      bg bg, font base/400

content
  left: icon (type-specific: Bell, Calendar, DollarSign, AlertTriangle)
  body: title (bold) + body snippet (2 lines max, text-muted)
  right: relative time ("5 phút trước") + unread dot (8px, accent)

tap → navigate to reference screen, mark as read

a11y   role="listitem", aria-label "Thông báo chưa đọc: Đơn nghỉ phép đã được duyệt"
       unread: aria-live="polite" for new incoming notifications

tokens bg accent-subtle (unread) | border-l 3px accent | p-4
used on S13
```

---

### Input / TextInput

```
states   empty | filled | focused | error | disabled

height   40px (md, default), 36px (sm)
border   1px border-input, radius sm
focused  border border-focus, ring 2px border-focus / 50% opacity

error    border danger, ring 2px danger / 30%, error message below
         icon AlertCircle (red) inside right edge

helper   small text below, font xs, text-muted
label    above, font sm/500, text

disabled opacity 50%, bg surface, cursor not-allowed

a11y   <input> or <textarea>, aria-required, aria-invalid="true" on error
       error linked via aria-describedby to error message id
       placeholder not used as only label (always pair with <label>)

tokens border border-input | radius sm | font base | p-3
```

---

### SegmentedControl

```
usage    leave_type picker, half_day_period, weekly/monthly toggle
height   36px
bg       surface, active segment bg surface-raised shadow xs
border   1px border, radius sm (wraps all), active segment radius xs (inset)

animation  active indicator slides between segments (motion-base ease)

a11y   role="tablist", each option role="tab", aria-selected
       keyboard: arrow keys navigate segments, Space/Enter select

tokens bg surface | radius sm | font sm/500
```

---

## Spacing System (4-base)

| token | px | use |
|-------|----|-----|
| space-1 | 4 | icon gap, badge padding |
| space-2 | 8 | tight internal padding |
| space-3 | 12 | card internal compact |
| space-4 | 16 | standard card padding, form field gap |
| space-5 | 20 | section spacing mobile |
| space-6 | 24 | section spacing, modal padding |
| space-8 | 32 | large section gap |
| space-10 | 40 | hero spacing |
| space-12 | 48 | page top padding (below header) |

---

## Motion Patterns

| pattern | duration | easing | use |
|---------|----------|--------|-----|
| Tab switch | 100ms | ease | BottomNavBar active indicator |
| Button press | 100ms | ease | scale 0.97 on active |
| Clock-in success | 300ms | spring | scale 1.0 → 1.08 → 1.0 |
| Modal enter | 180ms | ease | translate-y 20px → 0, fade |
| Sheet slide | 300ms | spring | bottom sheet from bottom |
| Toast | 180ms in / 100ms out | ease | slide from top |
| Skeleton | 1200ms | linear | shimmer left → right |
| Error shake | 300ms | spring | translate-x ±6px × 3 |

---

## Build Order for Primitives

1. `Button` (all variants + loading state)
2. `Input` + `Label` + error state
3. `StatusBadge`
4. `EmployeeAvatar`
5. `BottomNavBar`
6. `AttendanceCalendar` (monthly first, weekly second)
7. `ShiftCard`
8. `ClockButton`
9. `MapGeofence`
10. `LeaveRequestForm` (composes Input + Calendar + SegmentedControl)
11. `PayrollSummaryCard`
12. `ApprovalQueue`
13. `ExportModal`
14. `NotificationItem`

Build each in a `/design` route (web) or Storybook screen (mobile), all states visible, before using in a real screen.

---

## Accessibility Checklist

- [ ] All interactive elements reachable by keyboard Tab order
- [ ] Focus ring always visible (2px border-focus, 2px offset)
- [ ] Touch targets minimum 44×44px on mobile
- [ ] No information conveyed by colour alone (always icon or text too)
- [ ] Screen reader announces clock-in result via `aria-live="assertive"`
- [ ] Modal traps focus, Escape closes
- [ ] Form errors linked via `aria-describedby`
- [ ] Language set: `<html lang="vi">` or `lang="en"` per locale
- [ ] All images have `alt`, decorative images `alt=""`
- [ ] Contrast: 0 AA failures (verified by contrast.py)
