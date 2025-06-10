# 🏃‍♂️ Agile Sprint Plan – 1-Day Build

**Sprint Goal:** Deliver a functioning MVP of CapConnect with founder/investor onboarding, company profiles, basic investment interaction, and secure document sharing.

---

## 🕰️ Sprint Duration:

**Total Time:** 1 Day = **8 Hours**
**Sprint Type:** Timeboxed MVP sprint
**Team:**

* 1 Full Stack Dev
* 1 UI/UX Dev (or Tailwind template)
* 1 AI Agent or Prompt-based Dev Assistant
* 1 QA (optional)

---

## 📦 Deliverables

| Module             | Feature                                              |
| ------------------ | ---------------------------------------------------- |
| Auth               | Signup/login with role assignment (founder/investor) |
| Founder Dashboard  | Company creation, team, metrics input                |
| Investor Dashboard | Browse startups, commit intent                       |
| SPV View           | Display existing SPVs per company                    |
| Document Upload    | Upload pitch deck with permissions                   |
| Vector Store       | Chunk pitch deck, embed into pgvector                |
| Matching API       | Simple semantic match (investor ↔ founder)           |
| Notification Stub  | Show real-time updates on profile views or commits   |

---

## 🧱 Sprint Phases

### ⏱️ Hour 0–1: Setup & Scaffolding

* ✅ Initialize Next.js + Tailwind UI or similar frontend
* ✅ Set up Supabase project with Auth, DB
* ✅ Connect OpenCap Stack APIs via PostgREST or FastAPI proxy

---

### ⏱️ Hour 1–2: Authentication + RBAC

* Implement sign up / login flow
* Role selector (Founder or Investor)
* Set up Supabase Auth → store `role` in user metadata
* Route guards for dashboards

**APIs:**

* `Authentication`, `Users`, `RBAC`

---

### ⏱️ Hour 2–3: Founder Dashboard

* Company creation form: name, stage, industry, etc.
* Add team members UI
* Embed KYC/KYB status indicators

**APIs:**

* `Company Management`, `Employee Management`, `Compliance`

---

### ⏱️ Hour 3–4: Document Upload + pgvector Embedding

* Upload pitch deck (PDF or text)
* Store in `documents` table
* Auto-chunk and embed content using OpenAI → store in `document_chunks`

**APIs:**

* `Document Management`, `Webhooks`, `Vector DB` (`pgvector`)

---

### ⏱️ Hour 4–5: Investor Dashboard

* Browse list of companies (filtered by tag/industry)
* View company info, see metrics summary
* Click to "Request Intro" (log commitment intent)

**APIs:**

* `Company`, `Investor Management`, `Financial Metrics`, `Investment Management`

---

### ⏱️ Hour 5–6: SPV and Cap Table Viewer

* Visualize SPVs linked to company
* Show participating investors
* Render basic cap table (pie chart or table)

**APIs:**

* `SPV Management`, `Share Classes`, `Equity Plans`

---

### ⏱️ Hour 6–7: Matching + Notifications

* Match investors ↔ companies using `company_embeddings` + `user_embeddings`
* Stub for semantic search: "Show me climate SaaS startups"
* Notify founder when their deck is viewed

**APIs:**

* `Analytics`, `Notifications`, `pgvector`

---

### ⏱️ Hour 7–8: QA, Polish, Deploy

* Final smoke testing: Auth, Docs, Views, Commitments
* Push to Vercel/Fly.io
* Seed with 2 fake founders and 2 fake investors

---

## ✅ Success Criteria (Definition of Done)

| Goal              | Metric                                         |
| ----------------- | ---------------------------------------------- |
| Auth works        | Founder/Investor login shows correct dashboard |
| Company Profiles  | Founder can create & publish company           |
| Deck Upload       | PDF upload triggers chunk+embed flow           |
| Investor Browsing | Investor can view startups & request intro     |
| Semantic Search   | Basic vector search returns results            |
| SPV Preview       | At least one SPV rendered with members         |
| Notifications     | Founder sees alert when deck is viewed         |

---

## 📋 Optional Stretch Goals (if time permits)

* Add fuzzy search filter on industry tags
* Implement deal chat stub in Deal Room
* Display simple line chart of MRR from `financial_metrics`
* PDF preview in-browser with page navigation

---


