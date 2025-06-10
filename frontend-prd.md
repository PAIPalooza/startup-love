# 🧾 CapConnect Frontend Product Requirements Document (FRONTEND ONLY)

**Project Title**: CapConnect
**Tagline**: The smartest way to match capital with innovation
**Scope**: Frontend Only (UI, UX, State Management, API calls to OpenCap Stack)
**Version**: 1.0
**Stack**: Next.js + TailwindCSS + Supabase Auth + OpenCap APIs

---

## 🧭 Key UI Goals

* Clean, venture-grade design (not too playful, not too corporate)
* Role-specific dashboards (Founder, Investor, Admin)
* Real-time UI for deal and compliance workflows
* Responsive across mobile, tablet, and desktop
* Dynamic rendering of financial data & documents

---

## 🔐 Authentication Pages

### 1. **Login / Magic Link Auth**

* Input: Email only
* On submit: trigger Supabase magic link email
* If email already registered, auto-login; else prompt for role selection

### 2. **Role Select / Onboarding**

* Choose: Founder / Investor / Admin
* Input name, optional bio, upload logo/headshot (Founder)
* Optional stealth mode toggle (Investor)
* Store role in local/session state

---

## 🏠 Public Site (Pre-Login)

### 3. **Landing Page**

* Hero CTA: “Join the smartest fundraising network”
* Sections:

  * Platform Explainer (How it works)
  * Testimonials from founders/investors
  * Call to Action: Sign up → Magic Link

---

## 👤 Founder Views

### 4. **Founder Dashboard**

* Tabs: `Overview` | `Cap Table` | `SPVs` | `Documents` | `Deal Room` | `Analytics`
* Welcome header with name/company
* KPI cards: MRR, Runway, CAC, LTV

#### 4.1 Cap Table Module

* React chart for ownership breakdown
* Table of stakeholders, share class, % ownership
* Edit buttons (conditionally rendered if role = founder)

#### 4.2 SPV Management

* List of SPVs: name, % owned, # of investors
* Button: “Create SPV” → modal with OpenCap SPV API hook
* “Invite Investor” → triggers shareable invite link

#### 4.3 Document Vault

* Upload modal with drag & drop
* File viewer (PDF.js or native iframe)
* File access control UI (checkboxes: View / Download / Comment)
* Version history dropdown

#### 4.4 Deal Room (Private Threads)

* Real-time chat (WebSocket or Supabase Channels)
* File drop
* Log of access/view timestamps

#### 4.5 Analytics Dashboard

* Line/bar charts of investor activity (deck views, login frequency)
* Table of investor names, actions, relationship score (color-coded)
* Export PDF button

---

## 💼 Investor Views

### 5. **Investor Dashboard**

* Tabs: `Browse Startups` | `Your Deals` | `Analytics`
* Filters: Stage, Industry, Geography, Round Size
* Cards: Startup preview (Name, summary, metrics, button: View Profile)

#### 5.1 Browse Startups

* Modal: “Request Intro”
* Modal: “Commit Funds” → funds entry + % equity calculator

#### 5.2 Analytics

* Investment exposure by industry
* ROI projection tool
* “My Document Requests” tracker

---

## 🏢 Company Public Profile (Mixed View)

### 6. **Startup Profile Page**

* Visible to both Founders & Investors (permissions vary)
* Sections:

  * Summary & Pitch
  * Industry Tags
  * Team Members (LinkedIn-style cards)
  * Documents (with RBAC viewer)
  * Financial Metrics (tiles + sparkline charts)

---

## ⚙️ Admin Views

### 7. **Admin Console**

* Dashboard cards:

  * Pending KYC
  * SPV Compliance Issues
  * Suspicious Activity
* Tables:

  * All users (filter by role/status)
  * Compliance violations (link to user/company)
* Actions:

  * “Mark Verified”
  * “Suspend Account”
  * “Download Compliance Package”

---

## 📥 Notifications (Frontend Behavior)

* In-app toast + badge count (Bell icon)
* Channels: Email toggle (from Settings)
* Types:

  * New investor viewed your deck
  * Commitment made
  * Compliance issue raised

---

## 🧰 Shared UI Components

| Component           | Description                        |
| ------------------- | ---------------------------------- |
| `UserAvatar`        | Circle avatar + initials fallback  |
| `TagChip`           | Pill-style tag (industry/stage)    |
| `StatCard`          | Mini KPI with icon                 |
| `DealStatusStepper` | Timeline UI: Considering → Funded  |
| `SecureFileViewer`  | RBAC-controlled document viewer    |
| `SidebarNav`        | Role-based sidebar items           |
| `RoleBanner`        | Header bar showing user role & org |
| `WebhookLogItem`    | Admin log card for triggers        |
| `OnboardingWizard`  | First-time setup flow              |

---

## 🧪 Frontend Test Scenarios

| Component        | Test Case                                |
| ---------------- | ---------------------------------------- |
| Auth             | Magic link → redirect to role dashboard  |
| Role Routing     | Founder sees Founder dashboard only      |
| File Upload      | Upload → preview → permissions test      |
| Cap Table Chart  | Shares added → chart re-renders          |
| Notifications    | Commit → toast & bell icon update        |
| RBAC Enforcement | Investor denied access to edit cap table |
| Analytics Panel  | API fetches render graphs correctly      |

---

## 🔌 API Integration Map (Frontend → Backend)

| UI Action          | API Call                     |
| ------------------ | ---------------------------- |
| Login → Magic Link | Supabase Auth `magiclink()`  |
| Create SPV         | `POST /api/spvs`             |
| Upload File        | `POST /api/documents/upload` |
| Fetch Cap Table    | `GET /api/share-classes`     |
| KYC Check          | `GET /api/compliance/status` |
| Investor Commit    | `POST /api/investments`      |
| Notification Feed  | `GET /api/notifications`     |

---

## 🛠️ Developer Setup Instructions (Frontend Only)

```bash
npx create-next-app@latest capconnect-frontend
cd capconnect-frontend
npm install tailwindcss @supabase/supabase-js react-chartjs-2
npx tailwindcss init -p
```

* Add Supabase config in `.env`
* Use React Query or SWR for API hooks
* Structure:

  * `/pages` → Route views
  * `/components` → UI elements
  * `/hooks` → useAuth, useRole, useAPI
  * `/styles` → Tailwind config
  * `/lib` → API clients

---

## 📈 MVP Frontend Deliverables

* [x] Landing Page
* [x] Auth + Role Routing
* [x] Founder Dashboard (Cap table, SPV, Docs)
* [x] Investor Dashboard (Browse & Commit)
* [x] Admin Console
* [x] Notifications UI
* [x] Secure Document Viewer
* [x] Charts for Metrics/Analytics

---
