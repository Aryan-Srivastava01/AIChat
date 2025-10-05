# Environment Variables Guide - Docker vs Local Development

## Understanding Environment Variables in Docker Compose

### Quick Answer
**This project uses `env_file` in `docker-compose.yml`, which reads from service-specific `.env` files:**
- **Backend** reads from `backend/.env`
- **Frontend** reads from `frontend/.env.local`

**The same `.env` files work for both Docker and local development!**

---

## Visual Flow Chart

```
Both Local Development AND Docker Development:
==============================================
backend/.env → backend code (process.env.OPENROUTER_API_KEY)
frontend/.env.local → frontend code (import.meta.env.VITE_API_BASE_URL)

Docker reads the SAME files via env_file directive!
```

---

## Detailed Explanation

### 1. **Docker Compose `env_file` Directive**

When you write this in `docker-compose.yml`:
```yaml
backend:
  env_file:
    - ./backend/.env
```

**What happens:**
1. Docker Compose reads **ALL** variables from `backend/.env`
2. It loads them into the backend container as environment variables
3. Your backend code accesses them via `process.env.OPENROUTER_API_KEY`

### 2. **The Flow**

```
Step 1: You run docker-compose up
   ↓
Step 2: Docker Compose reads backend/.env and frontend/.env.local
   ↓
Step 3: Loads ALL variables from those files into respective containers
   ↓
Step 4: Creates containers with environment variables
   ↓
Step 5: Your application code (backend/frontend) reads process.env.VAR
```

---

## File Structure & Usage

```
AIChat/
├── docker-compose.yml            # ← Uses env_file directive
│   ├── backend:
│   │   └── env_file: ./backend/.env       # Reads from backend/.env
│   └── frontend:
│       └── env_file: ./frontend/.env.local # Reads from frontend/.env.local
│
├── backend/
│   ├── .env                      # ← Used for BOTH Docker AND local dev
│   │   └── OPENROUTER_API_KEY=xxx
│   │   └── HF_API_KEY=xxx
│   │   └── GOOGLE_GENERATIVE_AI_API_KEY=xxx
│   ├── .env.example              # ← Template for contributors
│   └── server.ts                 # ← Reads process.env.OPENROUTER_API_KEY
│
└── frontend/
    ├── .env.local                # ← Used for BOTH Docker AND local dev
    │   └── VITE_API_BASE_URL=xxx
    ├── .env.local.example        # ← Template for contributors
    └── src/                      # ← Reads import.meta.env.VITE_API_BASE_URL
```

---

## Example: Backend Environment Variables

### Scenario: Backend needs `OPENROUTER_API_KEY`

#### **Local Development (Without Docker):**
```bash
# File: backend/.env
OPENROUTER_API_KEY=sk-abc123
HF_API_KEY=hf_xyz789
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# Run:
cd backend
npm run dev

# What happens:
# → dotenv loads backend/.env
# → process.env.OPENROUTER_API_KEY = "sk-abc123"
```

#### **Docker Development (With Docker Compose):**
```bash
# File: backend/.env (SAME file as local dev!)
OPENROUTER_API_KEY=sk-abc123
HF_API_KEY=hf_xyz789
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# Run:
docker-compose up

# What happens:
# 1. Docker Compose reads backend/.env via env_file directive
# 2. Loads ALL variables from that file
# 3. Passes to container as environment variables
# 4. Inside container: process.env.OPENROUTER_API_KEY = "sk-abc123"
```

---

## Why This Design?

### **Docker Compose uses service-specific `.env` files via `env_file` because:**
1. ✅ **No duplication** - Same `.env` files for Docker AND local dev
2. ✅ **Simpler setup** - Contributors only set up service-specific `.env` files once
3. ✅ **Standard practice** - Each service manages its own configuration
4. ✅ **Isolation** - Backend and frontend have separate configurations
5. ✅ **Consistency** - Same behavior whether you use Docker or not

---

## Common Patterns in Docker Compose

### Pattern 1: env_file (Used in this project) ✅
```yaml
backend:
  env_file:
    - ./backend/.env
```
**Reads ALL variables from `backend/.env`**. Best for service-specific configs.

### Pattern 2: Hardcoded Value
```yaml
environment:
  - NODE_ENV=development
```
**Directly set**, no file needed. Good for non-secret constants.

### Pattern 3: Variable Substitution (Alternative approach)
```yaml
environment:
  - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
```
**Reads from ROOT `.env`**, substitutes value. Good for centralized configs.

---

## Best Practices for Your Project

### ✅ **One-Time Setup (Works for BOTH Docker AND Local):**
```bash
# Backend setup
cd backend
cp .env.example .env
# Edit .env and add your API keys

# Frontend setup
cd ../frontend
cp .env.local.example .env.local
# Edit .env.local (defaults should work)
```

### ✅ **Then Use Either Docker OR Local:**
```bash
# Option 1: Docker Development
docker-compose up

# Option 2: Local Development
cd backend && npm run dev
cd frontend && npm run dev
```

**Both use the SAME `.env` files!** No duplication needed.

---

## Troubleshooting

### Problem: "API key undefined in Docker"

**Likely cause:** `backend/.env` or `frontend/.env.local` doesn't exist or has wrong format

**Solution:**
```bash
# 1. Check if service .env exists
ls -la backend/.env
ls -la frontend/.env.local

# 2. Check format (no spaces around =)
# ✅ Correct:
OPENROUTER_API_KEY=sk-abc123

# ❌ Wrong:
OPENROUTER_API_KEY = sk-abc123
OPENROUTER_API_KEY= sk-abc123

# 3. Verify docker-compose sees it
docker-compose config
```

### Problem: "Works locally but not in Docker"

**Likely cause:** `.env` file has wrong format or wrong location

**Solution:** Verify files exist in correct locations:
```bash
# Should exist:
backend/.env
frontend/.env.local

# Create from examples if missing:
cd backend && cp .env.example .env
cd ../frontend && cp .env.local.example .env.local
```

---

## Summary Table

| Scenario | File Used | Command | Reads From |
|----------|-----------|---------|------------|
| **Local Backend** | `backend/.env` | `cd backend && npm run dev` | `backend/.env` via dotenv |
| **Local Frontend** | `frontend/.env.local` | `cd frontend && npm run dev` | `frontend/.env.local` via Vite |
| **Docker Backend** | `backend/.env` | `docker-compose up` | `backend/.env` via env_file |
| **Docker Frontend** | `frontend/.env.local` | `docker-compose up` | `frontend/.env.local` via env_file |

---

## Key Takeaway

```
docker-compose.yml with env_file directive
        ↓
    reads from
        ↓
Service-specific .env files:
  - backend/.env
  - frontend/.env.local
        ↓
SAME files used for local development! ✅
```

**Think of it this way:**
- **One .env setup** works for BOTH Docker AND local development
- **No duplication** = less confusion, easier maintenance
- **Service-specific configs** = better organization

