# 📚 CapConnect Backlog

**Project:** CapConnect
**Sprint Type:** 1-Day MVP Sprint
**Story Points:** Fibonacci Sequence (1, 2, 3) — no story exceeds 3 points.

---

## 🚀 Epic 1: Authentication & Role Management

### 🧑‍💼 Story 1.1 – Sign Up / Login with Role Assignment *(2 pts)*

* As a user, I want to sign up and choose my role (Founder or Investor) so I can access my specific dashboard.

### 🔐 Story 1.2 – Session Persistence & Logout *(1 pt)*

* As a user, I want to stay logged in during the session and be able to log out securely.

---

## 🏢 Epic 2: Founder Company Management

### 🏗️ Story 2.1 – Create Company Profile *(2 pts)*

* As a Founder, I want to create a company profile with fields like name, industry, stage, and description.

### 👥 Story 2.2 – Add Team Members *(2 pts)*

* As a Founder, I want to add co-founders and employees with roles and equity percentages.

### 🛂 Story 2.3 – View Compliance Status *(1 pt)*

* As a Founder, I want to see KYB/KYC compliance status on my dashboard.

---

## 📂 Epic 3: Document Upload & Embedding

### 📁 Story 3.1 – Upload Pitch Deck *(2 pts)*

* As a Founder, I want to upload pitch decks and term sheets with proper labels and access control.

### 🧠 Story 3.2 – Embed Document Using pgvector *(3 pts)*

* As a system, I want to chunk and embed uploaded documents for semantic search and matching.

---

## 💼 Epic 4: Investor Discovery & Deal Browsing

### 🔎 Story 4.1 – Browse Fundable Startups *(2 pts)*

* As an Investor, I want to browse a list of available startups with industry filters.

### 📄 Story 4.2 – View Company Details & Metrics *(2 pts)*

* As an Investor, I want to view a company’s profile, metrics, and uploaded documents.

### 💬 Story 4.3 – Request Intro / Commit to Invest *(2 pts)*

* As an Investor, I want to express interest or commit to invest in a company or SPV.

---

## 👥 Epic 5: SPV & Cap Table Display

### 💰 Story 5.1 – Show Active SPVs *(2 pts)*

* As a Founder, I want to view active SPVs linked to my company.

### 🧮 Story 5.2 – Render Cap Table Viewer *(3 pts)*

* As a user, I want to view a simplified cap table showing equity classes and ownership %.

---

## 🤖 Epic 6: Semantic Matching & Search

### 🧭 Story 6.1 – Embed Investor & Company Profiles *(2 pts)*

* As a system, I want to embed profiles using vector representations for smart search.

### 🧪 Story 6.2 – Build Matching API for Investors *(3 pts)*

* As an Investor, I want to find relevant startups based on my investment thesis via semantic search.

---

## 🛎️ Epic 7: Notifications & Activity

### 🔔 Story 7.1 – Notify Founder When Deck is Viewed *(1 pt)*

* As a Founder, I want to be notified when an Investor views my deck or profile.

### 📬 Story 7.2 – Basic Notification Center *(2 pts)*

* As a user, I want to see all my notifications in one place.

---

## ⚙️ Epic 8: Deployment, Testing, and QA

### 🧪 Story 8.1 – Smoke Test Dashboards *(1 pt)*

* As a QA or dev, I want to test both dashboards (Founder/Investor) to ensure they render correctly.

### 🚀 Story 8.2 – Deploy MVP to Vercel *(1 pt)*

* As a dev, I want to deploy the working MVP to Vercel for demo access.

### 🧑‍🔧 Story 8.3 – Seed Sample Data *(1 pt)*

* As a dev, I want to seed 2 Founders, 2 Investors, and 2 Companies with sample docs for demo purposes.

---

# ✅ Summary Table

| Epic | Title                 | Stories | Total Points |
| ---- | --------------------- | ------- | ------------ |
| 1    | Auth & RBAC           | 2       | 3            |
| 2    | Company Management    | 3       | 5            |
| 3    | Document Upload       | 2       | 5            |
| 4    | Investor Dashboard    | 3       | 6            |
| 5    | SPV & Cap Table       | 2       | 5            |
| 6    | Matching & Embeddings | 2       | 5            |
| 7    | Notifications         | 2       | 3            |
| 8    | Deployment & QA       | 3       | 3            |

**Total Stories:** 19
**Total Points:** 35
**Time Estimate:** \~7.5 to 8 hours with one full-stack dev and tools in place

---

