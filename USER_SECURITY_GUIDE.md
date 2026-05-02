# Umbra Treasury Disclosure - User Security Guide

## Introduction

Umbra Treasury Disclosure is built with security and privacy as core principles. This guide helps you understand how to use the application safely and protect your treasury data.

---

## Understanding Non-Custodial Security

### What "Non-Custodial" Means

**You control your private keys. We never see them.**

- Your wallet extension (Phantom, Solflare, etc.) holds your private keys
- The application only requests signatures for specific operations
- Your keys never leave your wallet
- We cannot access your funds or private data without your explicit approval

### Why This Matters

Traditional apps store your credentials on their servers. If their server is hacked, your data is compromised.

With Umbra Treasury Disclosure:
- Even if our servers are compromised, your private keys are safe
- Even if our database is leaked, your encrypted balances remain private
- Only you can authorize transactions and compliance grants

---

## Wallet Security Best Practices

### 1. Choose a Reputable Wallet

✅ **Recommended Wallets:**
- Phantom (most popular, well-audited)
- Solflare (open-source, security-focused)
- Backpack (newer, growing ecosystem)

❌ **Avoid:**
- Unknown wallet extensions with few users
- Wallets without recent updates
- Wallets with poor reviews or security incidents

### 2. Verify Your Wallet Extension

**Before connecting:**
1. Check the extension's publisher in your browser's extension store
2. Verify the number of users (popular wallets have millions)
3. Read recent reviews for security concerns
4. Ensure the extension URL matches the official website

**Warning Signs:**
- Extension asks for unusual permissions
- Extension name is slightly misspelled (e.g., "Phant0m" instead of "Phantom")
- Extension was recently published with few users

### 3. Protect Your Seed Phrase

Your seed phrase (12-24 words) is the master key to your wallet.

**Never:**
- Share your seed phrase with anyone (including us!)
- Store it in cloud storage, email, or messaging apps
- Take a screenshot of it
- Enter it into any website

**Do:**
- Write it on paper and store in a secure location
- Consider a hardware wallet for large amounts
- Use a password manager with encryption (optional)

### 4. Review Transaction Details

Before signing any transaction:
1. Check the recipient address matches your intent
2. Verify the amount is correct
3. Understand what the transaction does
4. If unsure, cancel and ask for help

---

## Phishing Protection

### Common Phishing Tactics

**Fake Websites:**
- Attackers create lookalike sites with similar URLs
- Example: `umbra-treasurey.com` (note the typo)

**How to Protect Yourself:**
- Bookmark the official site and always use the bookmark
- Check the URL carefully before connecting your wallet
- Look for HTTPS and the padlock icon

**Fake Support:**
- Attackers impersonate support staff in Discord, Telegram, or Twitter
- They ask for your seed phrase or private keys

**How to Protect Yourself:**
- Real support will NEVER ask for your seed phrase
- Real support will NEVER ask you to send them funds
- Always verify support accounts are official

**Malicious Wallet Extensions:**
- Attackers publish fake wallet extensions to browser stores
- These extensions steal your keys when you enter them

**How to Protect Yourself:**
- Only install wallets from official links
- Verify the publisher and user count
- Check reviews for security concerns

---

## Compliance Grant Security

### What is a Compliance Grant?

A compliance grant allows a specific party (auditor, tax authority, etc.) to decrypt and view your private treasury data within a defined scope.

**This is a powerful action. Be careful.**

### Before Granting Access

Ask yourself:
1. **Who is requesting access?** Verify their identity independently
2. **Why do they need access?** Is the reason legitimate?
3. **What scope are they requesting?** Is it appropriate for their role?
4. **Do I trust them?** Would I share this data with them in person?

### Red Flags

❌ **Do NOT grant access if:**
- The requester contacted you unsolicited
- The reason seems vague or suspicious
- They're asking for more scope than necessary
- You cannot verify their identity
- They're pressuring you to act quickly

✅ **It's probably safe if:**
- You initiated the relationship (hired an auditor, filed taxes)
- The requester is a known entity (established accounting firm)
- The scope matches their legitimate need
- You can verify their identity through official channels

### Confirmation Dialog

When you issue a compliance grant, you'll see a confirmation dialog that shows:
- The receiver's address
- The scope of access being granted
- A warning about the implications

**Read this carefully.** Once granted, the receiver can decrypt the specified data.

---

## Transaction Security

### Deposit Safety

When depositing into encrypted balance:
- Verify the destination address is yours
- Double-check the token mint address
- Confirm the amount (remember: base units, not decimals)
- Start with a small test amount if unsure

### Withdrawal Safety

When withdrawing from encrypted balance:
- Verify the destination address is yours
- Ensure you have sufficient encrypted balance
- Account for protocol fees
- Confirm the transaction in your wallet

### Amount Validation

The app uses "base units" for amounts:
- 1 USDC = 1,000,000 base units (6 decimals)
- 1 SOL = 1,000,000,000 base units (9 decimals)

**Always verify the displayed amount matches your intent.**

---

## Privacy Best Practices

### What Umbra Protects

✅ **Private by default:**
- Your encrypted token balances
- Transaction amounts (when using encrypted balances)
- Counterparty details (when using mixer/UTXOs)

❌ **Not automatically private:**
- Your wallet address (public on Solana)
- Public transaction metadata (timestamps, token types)
- Data you explicitly disclose via compliance grants

### Maximizing Privacy

1. **Use encrypted balances** for sensitive transactions
2. **Limit public memos** - don't include sensitive info
3. **Be selective with compliance grants** - only grant when necessary
4. **Use mixer/UTXO flows** for maximum unlinkability (when available)

### What We Store

**On our servers:**
- Your wallet address (public)
- DAO metadata (name, description)
- Transaction metadata (category, public labels)
- Umbra operation references (transaction signatures)
- Access logs (who requested what, when)

**NOT on our servers:**
- Your private keys
- Your seed phrase
- Your encrypted balance amounts (decrypted)
- Your viewing keys
- Private transaction details

---

## Incident Response

### If You Suspect Your Wallet is Compromised

**Act immediately:**
1. **Stop using the wallet** - do not sign any more transactions
2. **Create a new wallet** with a new seed phrase
3. **Transfer funds** from the compromised wallet to the new one
4. **Revoke compliance grants** if possible
5. **Report the incident** to your wallet provider

### If You Granted Access to the Wrong Party

**Damage control:**
1. **Document what was granted** (scope, receiver address)
2. **Attempt to revoke the grant** (if supported)
3. **Notify affected parties** if sensitive data was exposed
4. **Consider creating a new DAO** if the exposure is severe

### If You See Suspicious Activity

**Warning signs:**
- Transactions you didn't authorize
- Compliance grants you didn't issue
- Unexpected balance changes
- Unfamiliar wallet connections

**What to do:**
1. **Disconnect your wallet** from the app
2. **Check your wallet's transaction history** on Solana explorer
3. **Scan your device** for malware
4. **Contact support** through official channels only

---

## Security Checklist

### Before First Use
- [ ] Installed a reputable wallet extension
- [ ] Verified the wallet extension is authentic
- [ ] Secured your seed phrase offline
- [ ] Bookmarked the official Umbra Treasury Disclosure URL
- [ ] Read this security guide

### Before Each Session
- [ ] Verified you're on the correct URL
- [ ] Checked for HTTPS and padlock icon
- [ ] Connected the correct wallet
- [ ] Reviewed your wallet address matches expectations

### Before Each Transaction
- [ ] Reviewed transaction details in wallet popup
- [ ] Verified recipient address
- [ ] Confirmed amount is correct
- [ ] Understood what the transaction does

### Before Granting Compliance Access
- [ ] Verified requester's identity independently
- [ ] Confirmed the reason is legitimate
- [ ] Reviewed the scope is appropriate
- [ ] Read the confirmation dialog carefully
- [ ] Typed the confirmation phrase

---

## Getting Help Safely

### Official Support Channels

**Website:** [Your official website]
**Documentation:** [Your docs site]
**GitHub:** [Your GitHub repo]
**Discord:** [Your Discord server] (verify invite link)

### How to Verify Support is Real

✅ **Real support will:**
- Direct you to official documentation
- Ask about your issue without requesting sensitive info
- Provide help through official channels

❌ **Fake support will:**
- Ask for your seed phrase or private keys
- Request you send them funds "for verification"
- Pressure you to act quickly
- Contact you via DM without you asking

### Reporting Security Issues

If you discover a security vulnerability:
1. **Do not** post it publicly
2. **Email** security@[yourdomain] with details
3. **Include** steps to reproduce (if applicable)
4. **Wait** for a response before disclosing

---

## Advanced Security (Optional)

### Hardware Wallets

For maximum security, consider a hardware wallet:
- Ledger Nano S/X
- Trezor (if Solana-compatible)

Hardware wallets keep your private keys on a physical device that never connects directly to the internet.

### Multi-Signature (Future)

Multi-sig requires multiple parties to approve transactions. Useful for:
- DAO treasuries with multiple owners
- High-value accounts
- Shared organizational funds

### Session Timeouts

The app automatically clears your Umbra session when you close the browser. This prevents unauthorized access if you leave your device unattended.

**Best practice:** Always disconnect your wallet when done.

---

## Conclusion

Security is a shared responsibility. We've built Umbra Treasury Disclosure with security best practices, but your actions matter too.

**Remember:**
- Your keys, your crypto
- Verify before you sign
- Be skeptical of unsolicited contact
- When in doubt, ask for help through official channels

Stay safe, and enjoy private, accountable treasury management!

---

**Last Updated:** May 2026
**Version:** 1.0
