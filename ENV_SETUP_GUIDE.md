# Environment Variables Setup Guide

## Quick Start (Minimum Required)

For a working demo with **mock mode**, you only need these:

### Backend (`apps/api/.env`)
```env
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
API_PORT=3007
CORS_ORIGIN=http://localhost:5173
UMBRA_MODE=mock
```

### Frontend (`apps/web/.env`)
```env
PUBLIC_API_BASE_URL=http://localhost:3007
```

That's it! The app will work in mock mode for your demo.

---

## Full Environment Variables Reference

### Backend Variables (`apps/api/.env`)

#### 1. DATABASE_URL (Required)
**What it is:** PostgreSQL connection string for Supabase

**How to get it:**
1. Go to your Supabase project dashboard
2. Click "Project Settings" (gear icon)
3. Go to "Database" section
4. Find "Connection string" → "Session pooler"
5. Copy the URL (it should be on port 5432 or 6543)
6. Replace `[YOUR-PASSWORD]` with your actual database password

**Format:**
```env
DATABASE_URL=postgresql://postgres.sezghwrnvmygriefszkj:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

**Important:** 
- Do NOT add `?sslmode=require` or `?pgbouncer=true` to the URL
- SSL is handled by the pool configuration in code

#### 2. API_PORT (Optional)
**What it is:** Port the backend API runs on

**Default:** 3007

**Example:**
```env
API_PORT=3007
```

#### 3. CORS_ORIGIN (Required)
**What it is:** Frontend URL that's allowed to make API requests

**For local development:**
```env
CORS_ORIGIN=http://localhost:5173
```

**For production:**
```env
CORS_ORIGIN=https://your-frontend-domain.vercel.app
```

#### 4. UMBRA_MODE (Required)
**What it is:** Controls whether to use real Umbra SDK or mock data

**Options:**
- `mock` - Use fake data (perfect for demos, no wallet needed)
- `real` - Use actual Umbra protocol (requires wallet integration)

**For your demo, use:**
```env
UMBRA_MODE=mock
```

**For production:**
```env
UMBRA_MODE=real
```

#### 5. UMBRA_NETWORK (Optional, only needed if UMBRA_MODE=real)
**What it is:** Which Solana network to use

**Options:**
- `devnet` - Test network (free, for development)
- `mainnet` - Production network (real money)

**Default:** devnet

**Example:**
```env
UMBRA_NETWORK=devnet
```

#### 6. UMBRA_RPC_HTTP_URL (Optional)
**What it is:** Solana RPC endpoint for HTTP requests

**How to get it:**
- **Free (rate-limited):** Use public endpoints (default)
- **Paid (better performance):** Get from Helius, QuickNode, or Alchemy

**Defaults:**
- Mainnet: `https://api.mainnet-beta.solana.com`
- Devnet: `https://api.devnet.solana.com`

**Example with Helius:**
```env
UMBRA_RPC_HTTP_URL=https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
```

**For demo:** Leave empty to use defaults

#### 7. UMBRA_RPC_WS_URL (Optional)
**What it is:** Solana RPC endpoint for WebSocket connections

**Defaults:**
- Mainnet: `wss://api.mainnet-beta.solana.com`
- Devnet: `wss://api.devnet.solana.com`

**Example:**
```env
UMBRA_RPC_WS_URL=wss://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY
```

**For demo:** Leave empty to use defaults

#### 8. UMBRA_INDEXER_URL (Optional)
**What it is:** Umbra's UTXO indexer endpoint

**Defaults:**
- Mainnet: `https://utxo-indexer.api.umbraprivacy.com`
- Devnet: `https://utxo-indexer.api-devnet.umbraprivacy.com`

**For demo:** Leave empty to use defaults

#### 9. UMBRA_RELAYER_URL (Optional)
**What it is:** Umbra's relayer for claim operations

**Defaults:**
- Mainnet: `https://relayer.api.umbraprivacy.com`
- Devnet: `https://relayer.api-devnet.umbraprivacy.com`

**For demo:** Leave empty to use defaults

---

### Frontend Variables (`apps/web/.env`)

#### 1. PUBLIC_API_BASE_URL (Required)
**What it is:** URL of your backend API

**For local development:**
```env
PUBLIC_API_BASE_URL=http://localhost:3007
```

**For production:**
```env
PUBLIC_API_BASE_URL=https://your-api-domain.com
```

#### 2. PUBLIC_UMBRA_NETWORK (Optional)
**What it is:** Which Solana network the frontend should use

**Options:**
- `devnet` - Test network
- `mainnet` - Production network

**Default:** devnet

**Example:**
```env
PUBLIC_UMBRA_NETWORK=devnet
```

#### 3. PUBLIC_UMBRA_RPC_HTTP_URL (Optional)
**What it is:** Solana RPC endpoint for frontend

**For demo:** Leave empty to use defaults

**Example:**
```env
PUBLIC_UMBRA_RPC_HTTP_URL=https://api.devnet.solana.com
```

#### 4. PUBLIC_UMBRA_RPC_WS_URL (Optional)
**What it is:** Solana WebSocket endpoint for frontend

**For demo:** Leave empty to use defaults

**Example:**
```env
PUBLIC_UMBRA_RPC_WS_URL=wss://api.devnet.solana.com
```

#### 5. PUBLIC_UMBRA_INDEXER_URL (Optional)
**What it is:** Umbra indexer endpoint for frontend

**For demo:** Leave empty to use defaults

**Example:**
```env
PUBLIC_UMBRA_INDEXER_URL=https://utxo-indexer.api-devnet.umbraprivacy.com
```

---

## Step-by-Step Setup

### Step 1: Get Your Supabase Database URL

1. Log into [Supabase](https://supabase.com)
2. Open your project
3. Click the gear icon (Project Settings)
4. Go to "Database" in the left sidebar
5. Scroll to "Connection string"
6. Select "Session pooler" mode
7. Copy the connection string
8. Replace `[YOUR-PASSWORD]` with your actual database password

### Step 2: Create Backend .env File

1. Navigate to `apps/api/` folder
2. Create a file named `.env` (no extension)
3. Add these lines:

```env
DATABASE_URL=postgresql://postgres.YOUR_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:5432/postgres
API_PORT=3007
CORS_ORIGIN=http://localhost:5173
UMBRA_MODE=mock
```

4. Replace `YOUR_REF`, `YOUR_PASSWORD`, and `REGION` with your actual values
5. Save the file

### Step 3: Create Frontend .env File

1. Navigate to `apps/web/` folder
2. Create a file named `.env` (no extension)
3. Add this line:

```env
PUBLIC_API_BASE_URL=http://localhost:3007
```

4. Save the file

### Step 4: Verify Setup

Run this command to check if environment variables are loaded:

**Backend:**
```bash
cd apps/api
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set ✓' : 'Missing ✗')"
```

**Frontend:**
```bash
cd apps/web
node -e "require('dotenv').config(); console.log('PUBLIC_API_BASE_URL:', process.env.PUBLIC_API_BASE_URL ? 'Set ✓' : 'Missing ✗')"
```

---

## Testing Your Setup

### 1. Test Database Connection

```bash
cd apps/api
node -e "
const { Pool } = require('pg');
require('dotenv').config();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
pool.query('SELECT 1').then(() => {
  console.log('✓ Database connected');
  pool.end();
}).catch(err => {
  console.error('✗ Database error:', err.message);
  pool.end();
});
"
```

### 2. Start Backend

```bash
cd apps/api
pnpm dev
```

You should see:
```
Server listening on http://localhost:3007
```

### 3. Start Frontend

```bash
cd apps/web
pnpm dev
```

You should see:
```
Local: http://localhost:5173
```

### 4. Test the App

1. Open http://localhost:5173 in your browser
2. You should see the Umbra Treasury Disclosure homepage
3. Try connecting a wallet (Phantom, Solflare, etc.)
4. If it works, your setup is correct!

---

## Common Issues & Solutions

### Issue: "DATABASE_URL must include sslmode=require"
**Solution:** Remove `?sslmode=require` from your DATABASE_URL. SSL is handled in code.

### Issue: "CORS error" in browser console
**Solution:** Make sure `CORS_ORIGIN` in backend .env matches your frontend URL exactly.

### Issue: "Cannot connect to database"
**Solution:** 
1. Check your database password is correct
2. Verify your IP is whitelisted in Supabase (or use session pooler)
3. Make sure the connection string format is correct

### Issue: "Module not found" errors
**Solution:** Run `pnpm install` in both `apps/api` and `apps/web`

### Issue: Frontend can't reach backend
**Solution:** 
1. Make sure backend is running on port 3007
2. Check `PUBLIC_API_BASE_URL` in frontend .env
3. Verify no firewall is blocking localhost:3007

---

## Production Deployment

### Backend (Render, Railway, etc.)

Add these environment variables in your hosting platform:

```
DATABASE_URL=your_supabase_url
API_PORT=3007
CORS_ORIGIN=https://your-frontend-domain.vercel.app
UMBRA_MODE=mock
```

### Frontend (Vercel, Netlify, etc.)

Add these environment variables:

```
PUBLIC_API_BASE_URL=https://your-backend-domain.com
PUBLIC_UMBRA_NETWORK=devnet
```

**Important for Vercel:**
- Environment variables starting with `PUBLIC_` are exposed to the browser
- Never put secrets in `PUBLIC_` variables
- Backend URL is safe to expose (it's public anyway)

---

## Security Checklist

- [ ] `.env` files are in `.gitignore` (already done)
- [ ] Never commit `.env` files to git
- [ ] Never share your database password
- [ ] Use different passwords for dev and production
- [ ] Rotate database password if accidentally exposed
- [ ] Use environment variables in CI/CD, not hardcoded values

---

## Quick Reference Card

**Minimum for demo:**
```
Backend:  DATABASE_URL, CORS_ORIGIN, UMBRA_MODE=mock
Frontend: PUBLIC_API_BASE_URL
```

**For real Umbra integration:**
```
Backend:  + UMBRA_MODE=real, UMBRA_NETWORK
Frontend: + PUBLIC_UMBRA_NETWORK, PUBLIC_UMBRA_RPC_HTTP_URL
```

**For production:**
```
Backend:  Update CORS_ORIGIN to production frontend URL
Frontend: Update PUBLIC_API_BASE_URL to production backend URL
```

---

## Need Help?

If you're stuck:
1. Check the error message carefully
2. Verify all required variables are set
3. Test database connection separately
4. Make sure both backend and frontend are running
5. Check browser console for errors

**Still stuck?** Check the README.md or open an issue on GitHub.
