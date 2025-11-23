# Mezzingo Client Setup - Complete Instructions

**Client:** Mezzingo  
**Contact:** Midhun (midhun@mezzingo.com)  
**Customer ID:** `midhun_test_001`  
**Setup Date:** November 21, 2025

---

## 🔑 API Key (CONFIDENTIAL)

```
API Key: qlm9FNzxgK7weuDcO3S5IWv8PMfXaRntCLHE2hTy0jiVkoGrYB
```

**⚠️ This key cannot be retrieved again. Save it securely before proceeding.**

---

## 📋 Step 1: Add Documents to Firestore

### Option A: Using Firebase Console (Recommended)

1. **Go to:** https://console.firebase.google.com/project/rivoct-sandbox/firestore

2. **Add Customer Document:**
   - Collection: `customers`
   - Document ID: `midhun_test_001`
   - Fields (copy from `customer_mezzingo.json`):
     ```json
     {
       "id": "midhun_test_001",
       "name": "Mezzingo",
       "status": "active",
       "billingPlan": "sandbox",
       "apiKeyIds": [],
       "createdAt": "2025-11-20T20:53:59Z"
     }
     ```

3. **Add API Key Document:**
   - Collection: `api_keys`
   - Document ID: **AUTO-GENERATE** (let Firebase create it)
   - **IMPORTANT:** Note the auto-generated document ID (e.g., `abc123xyz`)
   - Fields (copy from `apikey_mezzingo.json`):
     ```json
     {
       "customerId": "midhun_test_001",
       "hash": "779f27df2f9d08e0e8d6eb71b65f1eca4db4b8087a94df5057db177ce29cb8b0",
       "salt": "slCWwSPivB7zn8O3beXrxdEaKmGJfQAy",
       "createdAt": "2025-11-20T20:53:59Z",
       "label": "Production Key - 2025-11-21",
       "revoked": false
     }
     ```

4. **Update Customer with API Key ID:**
   - Go back to `customers/midhun_test_001`
   - Edit the `apiKeyIds` field
   - Add the auto-generated API key document ID to the array:
     ```json
     "apiKeyIds": ["abc123xyz"]
     ```

5. **Add Usage Counter Document:**
   - Collection: `usage_counters`
   - Document ID: `midhun_test_001`
   - Fields (copy from `usage_mezzingo.json`):
     ```json
     {
       "customerId": "midhun_test_001",
       "minuteWindow": "2025-11-20T20:54",
       "minuteCount": 0,
       "dayWindow": "2025-11-20",
       "dayCount": 0,
       "monthWindow": "2025-11",
       "monthCount": 0,
       "totalCostInr": 0
     }
     ```

### Option B: Using Firebase CLI

```powershell
# Note: Firebase CLI doesn't support --data flag, use console instead
# Or use the Firebase Admin SDK programmatically
```

---

## 📧 Step 2: Send Welcome Email to Client

**To:** midhun@mezzingo.com  
**Subject:** Welcome to Rivoct Voice OTP API - Your Account is Ready

```
Hi Midhun,

Welcome to Rivoct Voice OTP API! Your account has been successfully created.

ACCOUNT DETAILS
================
Customer ID: midhun_test_001
API Endpoint: https://api-663012819768.asia-south1.run.app

API KEY (Keep this secure)
===========================
qlm9FNzxgK7weuDcO3S5IWv8PMfXaRntCLHE2hTy0jiVkoGrYB

⚠️ Important: Store this API key securely. It cannot be retrieved later.
   Never share it publicly or commit it to version control.

SANDBOX LIMITS
==============
- Per Minute: 5 calls
- Per Day: 100 calls
- Per Month: 1000 calls

PRICING
=======
₹0.32 per successful call

INTEGRATION GUIDE
=================
Please refer to the attached API_INTEGRATION_GUIDE.md for complete
integration instructions, including:
- Quick start examples
- Code samples (Node.js, Python, PHP, Java, cURL)
- Error handling
- Best practices
- Testing guidelines

QUICK TEST
==========
Test your API key with this cURL command:

curl -X POST https://api-663012819768.asia-south1.run.app/v1/voice-otp \
  -H "x-api-key: qlm9FNzxgK7weuDcO3S5IWv8PMfXaRntCLHE2hTy0jiVkoGrYB" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919876543210","otpCode":"123456"}'

Replace +919876543210 with your test Indian mobile number.

SUPPORT
=======
If you have any questions or need assistance:
- Email: support@rivoct.com
- Documentation: Refer to the integration guide

We're excited to have Mezzingo on board!

Best regards,
Rivoct Team
```

---

## ✅ Step 3: Verification Checklist

After setup, verify:

- [ ] Customer document exists in `customers/midhun_test_001`
- [ ] API key document exists in `api_keys/` with auto-generated ID
- [ ] Customer's `apiKeyIds` array contains the API key document ID
- [ ] Usage counter document exists in `usage_counters/midhun_test_001`
- [ ] Welcome email sent to midhun@mezzingo.com with API key
- [ ] API_INTEGRATION_GUIDE.md attached to email

---

## 🧪 Step 4: Test the Integration

Run this test command to verify everything works:

```bash
curl -X POST https://api-663012819768.asia-south1.run.app/v1/voice-otp \
  -H "x-api-key: qlm9FNzxgK7weuDcO3S5IWv8PMfXaRntCLHE2hTy0jiVkoGrYB" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919876543210","otpCode":"123456"}'
```

**Expected Response (HTTP 201):**
```json
{
  "requestId": "uuid-here",
  "status": "answered",
  "durationSeconds": 12,
  "billedAmountInr": 0.32
}
```

---

## 📊 Monitoring

After client starts using the API:

1. **Check usage:** https://console.firebase.google.com/project/rivoct-sandbox/firestore/data/~2Fusage_counters~2Fmidhun_test_001
2. **View logs:** Collection `voice_logs` filtered by `customerId == midhun_test_001`
3. **Monitor billing:** Collection `billing` filtered by `customerId == midhun_test_001`

---

## 🔒 Security Notes

- API key is hashed with SHA256 + per-key salt
- Hash: `779f27df2f9d08e0e8d6eb71b65f1eca4db4b8087a94df5057db177ce29cb8b0`
- Salt: `slCWwSPivB7zn8O3beXrxdEaKmGJfQAy`
- Only share the raw API key with the client, never the hash or salt

---

## 📁 Generated Files

- `customer_mezzingo.json` - Customer document data
- `apikey_mezzingo.json` - API key document data
- `usage_mezzingo.json` - Usage counter data
- `MEZZINGO_SETUP_INSTRUCTIONS.md` - This file

**Status:** Ready for production use ✅
