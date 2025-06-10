# 📘 Product Requirements Document

**Project Title:** CapConnect
**Tagline:** *The smartest way to match capital with innovation.*
**Version:** 1.0
**Created On:** 2025-06-10

---

## 🔍 Executive Summary

**CapConnect** is a modern, API-first fundraising and investor discovery platform that connects startup founders with accredited investors using OpenCap Stack APIs. It automates core venture workflows including cap table setup, document sharing, compliance checks, financial analysis, and equity structuring via SPVs.

---

## 🎯 Goals & Objectives

| Goal                                          | Objective                                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| 🚀 Help founders raise capital faster         | Streamline investor outreach, due diligence, and document handling                      |
| 🧠 Help investors discover and track startups | Personalized deal flow, analytics, and compliance confidence                            |
| 🔒 Ensure trust and compliance                | Enforce KYC/KYB, accredited investor verification, and document permissions             |
| 🧰 Leverage OpenCap APIs                      | Build quickly using authenticated endpoints with RBAC, docs, equity, and financial APIs |

---

## 👥 User Personas

### 👤 Founder

* Wants to raise a round (pre-seed to Series B)
* Needs to manage equity, documents, SPVs, and track investor activity
* Tech-savvy or first-time founder

### 🧑‍💼 Investor

* Accredited angel, syndicate lead, or institutional VC
* Wants to browse vetted startups, assess risk, and access data
* Values privacy, deal intelligence, and document integrity

### 👨‍💻 Admin

* Monitors compliance, onboarding, abuse prevention
* Manages RBAC, user tiers, and integrations (webhooks, analytics)

---

## 📐 Functional Requirements

### 1. **Authentication**

* OAuth2-compatible login
* Magic link or passwordless login via email
* Role assignment at sign-up (Founder, Investor, Admin)

---

### 2. **User Management**

* Profile with:

  * Name, bio, role, company
  * Optional verification badge
* Investors can toggle visibility ("stealth mode")

---

### 3. **Company Management**

* Founders create companies with:

  * Name, incorporation details, industry, pitch summary
  * Team members, domains, stage, funding raised

---

### 4. **SPV Management**

* Founders can create or join SPVs
* Investors can pool into SPVs to fund together
* Display structure (members, % ownership, terms)

---

### 5. **Document Management**

* Upload/share PDFs, pitch decks, SAFEs, term sheets
* Versioning + permissions (view, comment, download)
* Watermarking & secure links

---

### 6. **Equity Plans & Share Classes**

* Define equity pools and classes (Common, Preferred, SAFE)
* Assign shares to team, cap table visualization
* Investor view: cap table simulation pre/post investment

---

### 7. **Employee Management**

* Add team bios, headcount, founders’ equity
* Highlight advisors, contractors, open positions

---

### 8. **Investment Management**

* Founders set fundraising goal, instrument (e.g., SAFE)
* Investors commit funds or request intro
* Integrated deal flow board:

  * “Considering” → “In Discussion” → “Funded” → “Closed”

---

### 9. **Investor Management**

* CRM for founders to track interest
* Relationship scoring based on engagement
* Syndicate management (AngelList-style grouping)

---

### 10. **Financial Metrics**

* Auto-populated from OpenCap APIs
* MRR, ARR, burn rate, CAC, LTV, runway, etc.
* Visualized in dashboards with cohort filters

---

### 11. **Financial Reports**

* Upload balance sheet, P\&L, and cash flow
* Allow Investors to request audit files or export summaries
* Founder report generator (One-click investor update email)

---

### 12. **Compliance**

* KYC/KYB at onboarding
* Document checks for incorporation, tax ID, banking
* Real-time compliance status per user/company

---

### 13. **Tax Calculator**

* Founder side:

  * Estimate tax impact of exercising options or SAFEs
* Investor side:

  * Estimate ROI impact under various equity exit assumptions

---

### 14. **Analytics**

* Founders see:

  * Deck views, investor logins, document interest
* Investors see:

  * Startup growth over time, industry trends, exposure metrics

---

### 15. **Notifications**

* Activity (views, commits, uploads)
* Admin alerts (missing documents, fraud risk)
* Push/email channels

---

### 16. **RBAC**

* Founder: full access to own data
* Investor: limited read access; upgraded investors get deeper access
* Admin: superuser access for moderation, approvals, config

---

### 17. **Webhooks**

* Triggers:

  * New investor viewed deck
  * New commitment made
  * Compliance failure
* Can integrate with:

  * Slack, Notion, Linear, HubSpot, Salesforce

---

## 📊 UI/UX Flow

| Page                  | Modules                                            |
| --------------------- | -------------------------------------------------- |
| 🏠 Landing Page       | CTA, platform explainer, testimonials, sign up     |
| 🔐 Auth               | Magic link login, role select                      |
| 📈 Founder Dashboard  | Cap table, SPV, docs, deal room, investor activity |
| 💼 Investor Dashboard | Browse startups, commit funds, filter by tags      |
| 🏢 Company Profile    | Public summary + gated data (docs, metrics, team)  |
| 💬 Deal Room          | Chat, file sharing, secure access log              |
| ⚙️ Admin Console      | Compliance dashboard, user audits, RBAC panel      |

---

## 🗃️ Tech Stack (Recommended)

| Layer        | Tech                                  |
| ------------ | ------------------------------------- |
| Frontend     | Next.js, TailwindCSS                  |
| Backend      | OpenCap Stack APIs                    |
| Database     | Supabase (Postgres + pgvector)        |
| Auth         | Supabase Auth + OAuth (GitHub, Email) |
| File Storage | AWS S3 (via OpenCap)                  |
| Analytics    | OpenCap Analytics API                 |
| Deployment   | Vercel or Fly.io                      |

---

## ✅ MVP Features

* User sign-up/login with roles
* Founder company creation + document upload
* Investor profile + deal browsing
* SPV and equity modeling UI
* Document viewer with permissions
* Analytics dashboard for founder/investor
* Compliance flagging per user

---

## 🧪 QA & Testing Plan

| Area          | Test                                      |
| ------------- | ----------------------------------------- |
| Auth          | Role-based access test                    |
| Docs          | File upload/view/download/versioning      |
| SPV           | Join/create/invite workflows              |
| Equity        | Cap table rendering and updates           |
| Notifications | Email + webhook fire on commit            |
| Compliance    | Fail-state simulation (e.g., invalid KYC) |

---

## 📈 Success Metrics (MVP)

| Metric                 | Target                    |
| ---------------------- | ------------------------- |
| 🧑‍💼 Investor signups | 50+ in first 2 weeks      |
| 🧑‍🚀 Founder profiles | 25+ companies launched    |
| 📁 Docs shared         | >100 pitch decks uploaded |
| 💸 Commitments made    | >\$500K total commitments |
| ⏱️ Time to Launch      | ≤ 10 hours build time     |

---


