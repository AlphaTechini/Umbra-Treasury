# Next Steps: Complete Auditor Dashboard & Report Generation

## ✅ COMPLETED IMPLEMENTATION

All critical features from Phase 1 have been successfully implemented:

### 1. ✅ Fixed Wallet Authorization Message Format
**Location**: `apps/web/src/lib/session/walletAuthorization.ts` & `apps/api/src/utils/walletAuthorization.ts`

**Changes**:
- Frontend now generates human-readable signature messages instead of JSON
- Backend parser updated to handle both old JSON format (backward compatible) and new human-readable format
- Message format:
  ```
  Umbra Treasury Disclosure
  
  Action: Review Disclosure Request
  Wallet: <address>
  DAO: <daoId>
  Request: <requestId>
  
  Issued: <ISO timestamp>
  Expires: <ISO timestamp>
  ```

### 2. ✅ Added Backend Endpoint for Auditor's Requests by Wallet
**Location**: `apps/api/src/routes/disclosureRequests.ts`, `apps/api/src/services/disclosureService.ts`, `apps/api/src/repositories/disclosureRequestRepository.ts`

**New Endpoint**:
```
GET /disclosure-requests/by-wallet/:walletAddress
```

Returns all disclosure requests where `requesterContact` matches the wallet address, including the associated DAO information.

### 3. ✅ Updated Disclosure Review to Auto-Generate Report
**Location**: `apps/api/src/services/disclosureService.ts`

**Changes**:
- When a disclosure request is approved, the system automatically generates a mock report
- Report is linked to the disclosure request via `fulfilledReportId`
- Request status is updated to `fulfilled`
- No manual "Generate Report" button needed anymore

### 4. ✅ Created Auditor Dashboard Page
**Location**: `apps/web/src/routes/auditor/requests/+page.svelte`

**Features**:
- Requires wallet connection to view
- Fetches requests by connected wallet address
- Filter tabs: Pending, Approved, Rejected
- Shows request status with color-coded badges
- For fulfilled requests, provides "View Report" link
- For pending requests, shows "Waiting for approval"
- For rejected requests, shows "Request denied"

### 5. ✅ Created Report View Page
**Location**: `apps/web/src/routes/auditor/reports/[reportId]/+page.svelte`

**Features**:
- Requires wallet connection
- Access control: Only the requester (matching wallet) can view the report
- Displays report metadata (DAO, type, date range, transaction count)
- Shows source badge (Umbra Compliance vs Mock)
- Shows verification status badge
- Displays disclosed transactions in a table
- Shows report notes if available
- Back button to return to requests dashboard

### 6. ✅ Updated DAO Owner Disclosure Page
**Location**: `apps/web/src/routes/disclosures/+page.svelte`

**Changes**:
- Removed manual "Generate Mock Report" button
- Approval now auto-generates report
- Success message updated to indicate automatic report generation
- Simplified UI flow

### 7. ✅ Added Navigation Link
**Location**: `apps/web/src/lib/components/Sidebar.svelte`

**Changes**:
- Added "My Requests" link to sidebar navigation
- Uses ClipboardCheck icon
- Links to `/auditor/requests`

## Testing Flow

### As Auditor:
1. Connect wallet (use incognito browser for separate identity)
2. Visit public DAO page: `/daos/institutional-dao` (get slug from owner's "Share Link")
3. Click "Request Disclosure"
4. Fill form with wallet address as contact
5. Submit request
6. Go to `/auditor/requests` to see pending request

### As DAO Owner:
1. Go to `/disclosures`
2. See the auditor's request
3. Click "Approve"
4. Sign transaction with wallet
5. Report is automatically generated
6. Request status changes to "Fulfilled"

### As Auditor Again:
1. Refresh `/auditor/requests`
2. See request status changed to "Fulfilled"
3. Click "View Report"
4. View disclosed data at `/auditor/reports/[reportId]`

## Known Issues

### Pre-Existing Build Errors (Not Related to This Implementation):
1. **app.ts**: Fastify logger type issues (lines 16, 53-61)
2. **realUmbraProvider.ts**: Umbra SDK type export issues

These errors existed before this implementation and do not affect the new features.

## What's Next (Phase 2 - Optional Enhancements)

### 1. Email Notifications
- Notify auditor when request is approved/rejected
- Notify DAO owner when new request is submitted

### 2. Report Download
- Add CSV export for transactions
- Add PDF export for full report

### 3. Request Cancellation
- Allow auditors to cancel pending requests
- Add rejection reason field for DAO owners

### 4. Real X25519 Compliance Grants (Phase 3)
- Currently using mock disclosure
- Implement real Umbra X25519 grants for production

### 5. Report Verification
- Implement cryptographic verification of reports
- Show verification status prominently

### 6. Revoke Access Feature
- Allow DAO owners to revoke previously granted access
- Update report access control accordingly

## Files Modified

### Backend:
- `apps/api/src/routes/disclosureRequests.ts` - Added wallet filter endpoint
- `apps/api/src/services/disclosureService.ts` - Added wallet filter service, auto-generate report on approval
- `apps/api/src/repositories/disclosureRequestRepository.ts` - Added wallet filter query
- `apps/api/src/utils/walletAuthorization.ts` - Updated to parse human-readable messages

### Frontend:
- `apps/web/src/lib/session/walletAuthorization.ts` - Generate human-readable messages
- `apps/web/src/lib/api/disclosures.ts` - Added wallet filter API client
- `apps/web/src/lib/components/Sidebar.svelte` - Added "My Requests" link
- `apps/web/src/routes/disclosures/+page.svelte` - Removed manual report generation
- `apps/web/src/routes/auditor/requests/+page.svelte` - **NEW** Auditor dashboard
- `apps/web/src/routes/auditor/reports/[reportId]/+page.svelte` - **NEW** Report view page

## Database Schema (No Changes Required)

The existing schema already supports all implemented features:
- `disclosure_requests.requesterContact` stores wallet address
- `disclosure_requests.fulfilledReportId` links to generated report
- `reports` table stores disclosed transaction data
- Access control is enforced at application level

## Security Considerations

1. **Wallet-Based Access Control**: Reports can only be viewed by the wallet that requested them
2. **Signature Verification**: All approval actions require wallet signature
3. **Human-Readable Messages**: Users can now see exactly what they're signing
4. **Backward Compatibility**: Backend still accepts old JSON format for existing integrations

## Summary

All Phase 1 critical features have been successfully implemented. The auditor disclosure workflow is now complete:
- Auditors can request access with their wallet
- DAO owners can approve/reject requests
- Reports are automatically generated on approval
- Auditors can view their requests and reports
- All actions are secured with wallet signatures
- Signature messages are now human-readable

The system is ready for testing and can be deployed once the pre-existing build errors are resolved.
