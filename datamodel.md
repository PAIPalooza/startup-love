## 🗃️ RELATIONAL DATABASE MODEL (PostgreSQL)

### 🔐 `users`

```sql
id UUID PRIMARY KEY
email TEXT UNIQUE NOT NULL
role TEXT CHECK (role IN ('founder', 'investor', 'admin')) NOT NULL
full_name TEXT
bio TEXT
linkedin_url TEXT
is_verified BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT now()
```

---

### 🏢 `companies`

```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
name TEXT NOT NULL
industry TEXT
stage TEXT
website TEXT
description TEXT
founded_date DATE
country TEXT
kyb_status TEXT CHECK (kyb_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending'
created_at TIMESTAMP DEFAULT now()
```

---

### 👥 `team_members`

```sql
id UUID PRIMARY KEY
company_id UUID REFERENCES companies(id)
name TEXT
role TEXT
email TEXT
linkedin_url TEXT
equity_percent NUMERIC(5,2)
is_founder BOOLEAN DEFAULT FALSE
```

---

### 📂 `documents`

```sql
id UUID PRIMARY KEY
company_id UUID REFERENCES companies(id)
name TEXT
type TEXT CHECK (type IN ('pitch_deck', 'term_sheet', 'safe', 'cap_table', 'financials', 'custom'))
url TEXT
access_level TEXT CHECK (access_level IN ('public', 'investors', 'admins')) DEFAULT 'investors'
version INTEGER DEFAULT 1
uploaded_by UUID REFERENCES users(id)
created_at TIMESTAMP DEFAULT now()
```

---

### 📈 `financial_metrics`

```sql
id UUID PRIMARY KEY
company_id UUID REFERENCES companies(id)
month DATE NOT NULL
mrr NUMERIC
arr NUMERIC
burn_rate NUMERIC
runway_months NUMERIC
ltv NUMERIC
cac NUMERIC
updated_by UUID REFERENCES users(id)
```

---

### 📊 `financial_reports`

```sql
id UUID PRIMARY KEY
company_id UUID REFERENCES companies(id)
name TEXT
report_type TEXT CHECK (report_type IN ('P&L', 'balance_sheet', 'cash_flow', 'forecast'))
url TEXT
uploaded_by UUID REFERENCES users(id)
created_at TIMESTAMP DEFAULT now()
```

---

### 💼 `spvs`

```sql
id UUID PRIMARY KEY
name TEXT
company_id UUID REFERENCES companies(id)
creator_id UUID REFERENCES users(id)
status TEXT CHECK (status IN ('active', 'closed')) DEFAULT 'active'
target_raise NUMERIC
committed_amount NUMERIC DEFAULT 0
created_at TIMESTAMP DEFAULT now()
```

---

### 🤝 `spv_members`

```sql
id UUID PRIMARY KEY
spv_id UUID REFERENCES spvs(id)
investor_id UUID REFERENCES users(id)
amount_committed NUMERIC
joined_at TIMESTAMP DEFAULT now()
```

---

### 💸 `investments`

```sql
id UUID PRIMARY KEY
investor_id UUID REFERENCES users(id)
company_id UUID REFERENCES companies(id)
amount NUMERIC
status TEXT CHECK (status IN ('committed', 'in_discussion', 'cancelled', 'closed'))
instrument TEXT CHECK (instrument IN ('SAFE', 'Equity', 'Convertible Note'))
note TEXT
created_at TIMESTAMP DEFAULT now()
```

---

### 📢 `notifications`

```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
message TEXT
type TEXT CHECK (type IN ('view', 'commitment', 'compliance', 'general'))
is_read BOOLEAN DEFAULT FALSE
created_at TIMESTAMP DEFAULT now()
```

---

### 📬 `webhooks`

```sql
id UUID PRIMARY KEY
event TEXT
target_url TEXT
secret TEXT
created_by UUID REFERENCES users(id)
created_at TIMESTAMP DEFAULT now()
```

---

### 🛂 `compliance_checks`

```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
kyc_status TEXT CHECK (kyc_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending'
kyb_status TEXT CHECK (kyb_status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending'
last_checked TIMESTAMP
updated_by UUID REFERENCES users(id)
```

---

## 🧠 VECTOR DATABASE MODEL (`pgvector`)

### 📘 `document_chunks`

Used for semantic search of pitch decks, financial reports, term sheets, etc.

```sql
id UUID PRIMARY KEY
document_id UUID REFERENCES documents(id)
content TEXT -- original text chunk
embedding VECTOR(1536) -- OpenAI/any encoder output
chunk_index INTEGER
created_at TIMESTAMP DEFAULT now()
```

---

### 🔍 `user_embeddings`

Used for semantic matching of investors and founders (e.g., "I'm looking for a climate tech startup...")

```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES users(id)
profile_summary TEXT
embedding VECTOR(1536)
created_at TIMESTAMP DEFAULT now()
```

---

### 🧮 `company_embeddings`

Used for AI-powered deal matching, vector-based search on company descriptions.

```sql
id UUID PRIMARY KEY
company_id UUID REFERENCES companies(id)
description TEXT
embedding VECTOR(1536)
created_at TIMESTAMP DEFAULT now()
```

---

## ⚖️ Relational–Vector Sync Triggers (Suggested)

* On document upload → chunk + embed → `document_chunks`
* On founder profile update → embed → `user_embeddings`
* On company edit → embed description → `company_embeddings`
* On financial report upload → parse + embed as summary

---

