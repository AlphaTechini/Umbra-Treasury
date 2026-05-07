# Quick Start Guide - Umbra Treasury Disclosure

## ⚡ 5-Minute Setup

Your environment variables are already configured! Just follow these steps:

### 1. Test Your Setup (Optional but Recommended)

```bash
node test-setup.mjs
```

This will verify:
- ✓ All environment variables are set
- ✓ Database connection works
- ✓ Configuration is correct

### 2. Start the Backend

Open a terminal and run:

```bash
pnpm dev:api
```

You should see:
```
Server listening on http://localhost:3007
```

**Keep this terminal open!**

### 3. Start the Frontend

Open a **new terminal** and run:

```bash
pnpm dev:web
```

You should see:
```
Local: http://localhost:5173
```

### 4. Open the App

Go to: **http://localhost:5173**

---

## 🎯 Demo Flow

### Step 1: Connect Wallet
1. Click "Connect Wallet" button
2. Choose your wallet (Phantom, Solflare, etc.)
3. Approve the connection in your wallet popup

### Step 2: Create DAO (Automatic)
- A DAO is automatically created when you connect
- You'll see your DAO dashboard

### Step 3: Add Treasury Activity
1. Go to "Transactions" page
2. Click "Add Transaction"
3. Fill in:
   - Type: Income/Expense
   - Category: Grant/Payroll/Vendor/etc.
   - Token: USDC/USDT/SOL
   - Amount: Any number (it's mock data)
   - Public memo: Optional description
4. Click "Add Transaction"

### Step 4: View Public Summary
1. Go to "Dashboard"
2. See aggregated totals (no private details shown)
3. Category breakdowns visible
4. Individual transaction details hidden

### Step 5: Request Disclosure
1. Go to "Disclosures" page
2. Click "Request Disclosure"
3. Fill in:
   - Requester name: "Auditor Name"
   - Organization: "Audit Firm"
   - Reason: "Audit"
   - Scope: "Full Report"
4. Submit request

### Step 6: Approve Disclosure (as DAO Owner)
1. See pending request in "Disclosures" page
2. Click "Review"
3. Click "Approve"
4. Report is generated

### Step 7: View Reports
1. Go to "Reports" page
2. See generated reports
3. Each report shows:
   - Source: "mock" (clearly labeled)
   - Verification status: "unverified"
   - Report data

### Step 8: Check Access Logs
1. Scroll down on any page
2. See "Access Log" panel
3. All actions are logged:
   - Who did what
   - When it happened
   - What was accessed

---

## 🔧 Current Configuration

### Backend (`apps/api/.env`)
```
DATABASE_URL: ✓ Set (Supabase session pooler)
API_PORT: 3007
CORS_ORIGIN: http://localhost:5173
UMBRA_MODE: mock (perfect for demo)
UMBRA_NETWORK: devnet
```

### Frontend (`apps/web/.env`)
```
PUBLIC_API_BASE_URL: http://localhost:3007
PUBLIC_UMBRA_NETWORK: devnet
PUBLIC_UMBRA_RPC_HTTP_URL: https://api.devnet.solana.com
PUBLIC_UMBRA_RPC_WS_URL: wss://api.devnet.solana.com
PUBLIC_UMBRA_INDEXER_URL: https://utxo-indexer.api-devnet.umbraprivacy.com
```

---

## 🎭 Mock Mode vs Real Mode

### Current: Mock Mode ✓
- No real blockchain transactions
- No wallet signatures required (except for auth)
- Instant operations
- Perfect for demos and testing
- All data clearly labeled as "mock"

### Real Mode (Future)
- Actual Umbra protocol integration
- Real blockchain transactions
- Wallet signatures required
- Protocol fees apply
- Verified compliance grants

**For your demo, mock mode is perfect!**

---

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check if port 3007 is already in use
netstat -ano | findstr :3007

# If something is using it, kill the process or change API_PORT in .env
```

### Frontend won't start
```bash
# Check if port 5173 is already in use
netstat -ano | findstr :5173

# If something is using it, the dev server will auto-increment to 5174
```

### Database connection error
```bash
# Test connection manually
node test-setup.mjs

# If it fails, check:
# 1. DATABASE_URL is correct
# 2. No trailing ? or extra characters
# 3. Password is correct
# 4. Supabase project is running
```

### CORS error in browser
- Make sure backend is running on port 3007
- Check `CORS_ORIGIN` in backend .env matches frontend URL
- Restart backend after changing .env

### "Module not found" errors
```bash
# Install dependencies
pnpm install

# Or install in each app
cd apps/api && pnpm install
cd apps/web && pnpm install
```

---

## 📊 What to Show in Your Demo

### 1. Privacy by Default
- Show that transaction details are hidden in public view
- Only aggregates are visible
- Individual amounts are not exposed

### 2. Selective Transparency
- Show disclosure request flow
- Demonstrate owner approval process
- Show how reports are generated with clear source labels

### 3. Accountability
- Show access logs
- Demonstrate that all actions are tracked
- Show who requested what and when

### 4. Non-Custodial Design
- Explain that wallet connection is required
- Show that private keys never leave the wallet
- Demonstrate that backend only stores metadata

### 5. Umbra Integration
- Explain mock mode vs real mode
- Show that real Umbra provider exists (check `apps/api/src/providers/realUmbraProvider.ts`)
- Explain that frontend Umbra integration is complete (check `apps/web/src/lib/umbra/`)
- Reference `UMBRA_INTEGRATION_STATUS.md` for full details

---

## 🎤 Demo Script

**Opening:**
"Umbra Treasury Disclosure solves the conflict between Web3 transparency and real-world financial privacy. DAOs need privacy for salaries, vendors, and negotiations, but they also need accountability."

**Show the Problem:**
"Traditional blockchains expose everything. Private solutions hide everything. Neither works for real organizations."

**Show the Solution:**
1. Connect wallet → "Non-custodial, your keys stay in your wallet"
2. Add transactions → "Private by default, only metadata stored"
3. View dashboard → "Public sees aggregates, not details"
4. Request disclosure → "Auditors can request scoped access"
5. Approve request → "Owner controls what gets disclosed"
6. View report → "Clearly labeled source and verification status"
7. Check logs → "Full accountability trail"

**Closing:**
"This is running in mock mode for the demo, but the real Umbra integration is ready. The architecture is non-custodial, the provider boundary is clean, and the frontend integration is complete. We just need to switch `UMBRA_MODE` to `real` and connect the wallet signer."

---

## 📚 Additional Resources

- **ENV_SETUP_GUIDE.md** - Detailed environment variable documentation
- **UMBRA_INTEGRATION_STATUS.md** - Full Umbra integration details
- **FRONTEND_SECURITY_ANALYSIS.md** - Security audit and best practices
- **USER_SECURITY_GUIDE.md** - User-facing security documentation
- **README.md** - Project overview and architecture

---

## ⏱️ Time-Saving Tips

### If you're really short on time:

1. **Skip the test script** - Your env is already set up
2. **Just run:**
   ```bash
   pnpm dev:api
   # Wait for "Server listening"
   pnpm dev:web
   # Open http://localhost:5173
   ```
3. **Connect wallet and click around** - The flow is intuitive
4. **Focus on the story** - Privacy + Accountability = Umbra Treasury Disclosure

### If something breaks:

1. **Restart both servers** (Ctrl+C and run again)
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Check browser console** for errors
4. **Check terminal output** for backend errors

---

## 🎉 You're Ready!

Everything is configured. Just start the servers and demo away!

**Good luck with your presentation! 🚀**
