# Voice OTP Integration Workflow

**Document Version:** 1.0  
**Date:** November 21, 2025  
**Customer:** Mezzingo  
**Service:** Rivoct Voice OTP API

---

## Overview

This document outlines the complete integration workflow for implementing Voice OTP authentication in your application using the Rivoct Voice OTP API.

---

## Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        YOUR APPLICATION                              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 1: User Requests Verification                                 │
│  • User clicks "Send OTP" / "Login" / "Verify Phone"                │
│  • Your app captures phone number: +91XXXXXXXXXX                    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 2: Generate OTP (Your Backend)                                │
│  • Generate 4-6 digit random OTP code                               │
│  • Store OTP in your database with:                                 │
│    - Phone number                                                   │
│    - OTP code                                                       │
│    - Expiry time (5-10 minutes)                                     │
│    - Verification status (pending)                                  │
│    - Session ID                                                     │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 3: Call Rivoct API (Your Backend)                             │
│                                                                      │
│  POST https://api-wju6e5vpmq-el.a.run.app/v1/voice-otp              │
│  Headers:                                                            │
│    x-api-key: <YOUR_API_KEY>                                        │
│    Content-Type: application/json                                   │
│                                                                      │
│  Body:                                                               │
│  {                                                                   │
│    "phone": "+919876543210",                                        │
│    "otpCode": "654321",                                             │
│    "metadata": {                                                    │
│      "userId": "user_12345",                                        │
│      "purpose": "login",                                            │
│      "sessionId": "sess_abc123"                                     │
│    }                                                                 │
│  }                                                                   │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 4: Rivoct Processes Request                                   │
│  • Validates API key                                                │
│  • Checks rate limits                                               │
│  • Initiates voice call to user's phone                             │
│  • Returns response with requestId                                  │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 5: API Response (Immediate)                                   │
│                                                                      │
│  HTTP 201 Created                                                   │
│  {                                                                   │
│    "requestId": "550e8400-e29b-41d4-a716-446655440000",             │
│    "status": "answered",                                            │
│    "durationSeconds": 12,                                           │
│    "billedAmountInr": 0.32                                          │
│  }                                                                   │
│                                                                      │
│  • Store requestId for tracking/support                             │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 6: User Receives Call (5-15 seconds)                          │
│  • User's phone rings                                               │
│  • Automated voice message plays:                                   │
│    "Your verification code is 6-5-4-3-2-1"                          │
│  • User notes down the OTP                                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 7: User Enters OTP (Your Application)                         │
│  • User enters OTP in your app's input field                        │
│  • Your frontend sends OTP to your backend                          │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 8: Validate OTP (Your Backend)                                │
│  • Check if OTP matches stored value                                │
│  • Verify OTP has not expired                                       │
│  • Check if OTP has not been used already                           │
│  • Update verification status                                       │
│                                                                      │
│  IF VALID:                                                           │
│    • Mark session as authenticated                                  │
│    • Delete/invalidate OTP from database                            │
│    • Grant user access                                              │
│                                                                      │
│  IF INVALID:                                                         │
│    • Increment failed attempt counter                               │
│    • Show error to user                                             │
│    • Allow retry (with rate limiting)                               │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│  STEP 9: User Authenticated                                          │
│  • Proceed with user's intended action                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Responsibilities

### Your Responsibilities (Mezzingo)

| Component | Description |
|-----------|-------------|
| **OTP Generation** | Generate cryptographically secure random OTP codes (4-6 digits) |
| **OTP Storage** | Store OTP with expiry time and verification status in your database |
| **OTP Validation** | Validate user-entered OTP against stored value |
| **Expiry Management** | Enforce OTP expiry (recommended: 5-10 minutes) |
| **Rate Limiting** | Implement client-side rate limiting for OTP requests |
| **User Experience** | Display UI for OTP input, error messages, retry options |
| **Security** | Protect API key, implement HTTPS, log security events |
| **Error Handling** | Handle API failures gracefully with retry logic |

### Rivoct's Responsibilities

| Component | Description |
|-----------|-------------|
| **Voice Delivery** | Deliver OTP via automated voice call to specified phone number |
| **API Authentication** | Validate API key and enforce authorization |
| **Rate Limiting** | Enforce per-minute, per-day, per-month quotas |
| **Call Tracking** | Generate unique requestId for each call |
| **Billing** | Track usage and charge per successful delivery |
| **Infrastructure** | Maintain API uptime (99.9% SLA) |
| **Support** | Provide technical support for integration issues |

---

## Sample Implementation (Node.js)

### Backend - Send OTP Endpoint

```javascript
// POST /api/send-otp
import axios from 'axios';
import crypto from 'crypto';

async function sendOTP(req, res) {
  const { phone, userId, purpose } = req.body;
  
  // 1. Validate phone number format
  if (!/^\+91[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Invalid phone number' });
  }
  
  // 2. Check rate limit (implement based on your needs)
  // e.g., max 3 OTP requests per phone number per hour
  
  // 3. Generate OTP
  const otpCode = crypto.randomInt(100000, 999999).toString();
  
  // 4. Store OTP in database
  const sessionId = crypto.randomUUID();
  const expiryTime = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  await db.otpSessions.create({
    sessionId,
    phone,
    otpCode,
    userId,
    purpose,
    expiryTime,
    verified: false,
    attempts: 0,
  });
  
  // 5. Call Rivoct API
  try {
    const response = await axios.post(
      'https://api-wju6e5vpmq-el.a.run.app/v1/voice-otp',
      {
        phone,
        otpCode,
        metadata: { userId, purpose, sessionId }
      },
      {
        headers: {
          'x-api-key': process.env.VOICE_OTP_API_KEY,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    // 6. Store Rivoct requestId for tracking
    await db.otpSessions.update(sessionId, {
      rivoct_request_id: response.data.requestId,
      call_status: response.data.status
    });
    
    // 7. Return success to frontend
    return res.status(200).json({
      success: true,
      sessionId,
      message: 'OTP sent successfully. You will receive a call shortly.',
      expiresIn: 600 // seconds
    });
    
  } catch (error) {
    console.error('Rivoct API Error:', error.response?.data || error.message);
    
    // 8. Handle API errors
    if (error.response?.status === 429) {
      return res.status(429).json({
        error: 'Rate limit exceeded. Please try again later.'
      });
    }
    
    return res.status(500).json({
      error: 'Failed to send OTP. Please try again.'
    });
  }
}
```

### Backend - Verify OTP Endpoint

```javascript
// POST /api/verify-otp
async function verifyOTP(req, res) {
  const { sessionId, otpCode } = req.body;
  
  // 1. Retrieve OTP session from database
  const session = await db.otpSessions.findOne({ sessionId });
  
  if (!session) {
    return res.status(404).json({ error: 'Invalid session' });
  }
  
  // 2. Check if already verified
  if (session.verified) {
    return res.status(400).json({ error: 'OTP already used' });
  }
  
  // 3. Check expiry
  if (new Date() > session.expiryTime) {
    return res.status(400).json({ error: 'OTP expired. Request a new one.' });
  }
  
  // 4. Check max attempts (prevent brute force)
  if (session.attempts >= 5) {
    return res.status(429).json({ error: 'Too many attempts. Request a new OTP.' });
  }
  
  // 5. Verify OTP
  if (session.otpCode === otpCode) {
    // SUCCESS
    await db.otpSessions.update(sessionId, {
      verified: true,
      verifiedAt: new Date()
    });
    
    // Create authenticated session for user
    const authToken = generateAuthToken(session.userId);
    
    return res.status(200).json({
      success: true,
      message: 'Phone number verified successfully',
      authToken
    });
  } else {
    // FAILURE
    await db.otpSessions.increment(sessionId, 'attempts');
    
    return res.status(400).json({
      error: 'Invalid OTP',
      attemptsRemaining: 5 - (session.attempts + 1)
    });
  }
}
```

---

## Error Handling Strategy

### Rivoct API Errors

| Status Code | Error Type | Your Action |
|-------------|------------|-------------|
| **400** | Invalid payload | Fix request format, validate phone number |
| **401** | Invalid API key | Check API key is correct and active |
| **429** | Rate limit exceeded | Implement exponential backoff, inform user |
| **500** | Server error | Retry with exponential backoff (max 3 attempts) |

### Retry Logic Example

```javascript
async function sendOTPWithRetry(phone, otpCode, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await sendVoiceOTP(phone, otpCode);
    } catch (error) {
      // Don't retry on client errors (400, 401)
      if (error.response?.status < 500) {
        throw error;
      }
      
      // Last attempt - throw error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

---

## Security Best Practices

### 1. API Key Protection
- ✅ Store in environment variables: `VOICE_OTP_API_KEY`
- ✅ Never commit to version control
- ✅ Use secret management systems (AWS Secrets Manager, Google Secret Manager)
- ✅ Rotate keys every 90 days

### 2. OTP Security
- ✅ Use cryptographically secure random generator
- ✅ Set expiry time (5-10 minutes)
- ✅ Invalidate after successful verification
- ✅ Limit verification attempts (max 5)
- ✅ Don't log OTP codes in plain text

### 3. Rate Limiting
- ✅ Max 3 OTP requests per phone per hour
- ✅ Max 10 OTP requests per user per day
- ✅ Track and block suspicious patterns

### 4. Phone Number Validation
- ✅ Validate format before API call: `/^\+91[6-9]\d{9}$/`
- ✅ Sanitize input (remove spaces, dashes)
- ✅ Block known fraud numbers

---

## Testing Checklist

### Pre-Production Testing

- [ ] Successfully send OTP to test number
- [ ] Verify OTP delivery time (should be < 15 seconds)
- [ ] Test OTP validation (correct code)
- [ ] Test OTP validation (incorrect code)
- [ ] Test OTP expiry enforcement
- [ ] Test rate limiting (per minute)
- [ ] Test invalid phone format handling
- [ ] Test API key authentication
- [ ] Test network timeout handling
- [ ] Test retry logic on API failures
- [ ] Verify requestId logging
- [ ] Test concurrent requests

### Production Monitoring

- [ ] Set up logging for all API calls
- [ ] Monitor success/failure rates
- [ ] Track average delivery time
- [ ] Alert on unusual error rates
- [ ] Monitor API quota usage
- [ ] Review security logs regularly

---

## Production Launch Steps

### Phase 1: Initial Testing (Days 1-2)
1. ✅ Credentials received and stored securely
2. ✅ Integration guide reviewed
3. ⏳ Test environment configured
4. ⏳ Test OTP flow end-to-end
5. ⏳ Error handling implemented

### Phase 2: Limited Rollout (Days 3-5)
1. ⏳ Deploy to staging environment
2. ⏳ Test with internal users (10-20 calls)
3. ⏳ Monitor for issues
4. ⏳ Verify billing/usage tracking

### Phase 3: Production Launch (Day 6+)
1. ⏳ Deploy to production
2. ⏳ Enable for 10% of users
3. ⏳ Monitor for 24 hours
4. ⏳ Gradually increase to 100%

---

## Support & Troubleshooting

### Common Issues

**Issue:** "Invalid API key" error  
**Solution:** Verify API key is correct (refer to your Welcome Email for credentials)

**Issue:** "Rate limit exceeded"  
**Solution:** Implement client-side throttling, check quota at `/v1/usage/summary`

**Issue:** User didn't receive call  
**Solution:** Verify phone format is correct (+91XXXXXXXXXX), check requestId in logs

**Issue:** High latency  
**Solution:** Implement async/background job for API calls, don't block user flow

### Getting Help

**Email:** support@rivoct.com  
**Response Time:** 
- General queries: 24 hours
- Critical issues: 4 hours

**When contacting support, provide:**
1. Customer ID: `midhun_test_001`
2. Request ID from failed call
3. Timestamp of issue
4. Error message received
5. Phone number (masked: +91XXXXX54210)

---

## API Reference Quick Links

- **Base URL:** https://api-wju6e5vpmq-el.a.run.app
- **Health Check:** GET /health
- **Send OTP:** POST /v1/voice-otp
- **Usage Stats:** GET /v1/usage/summary
- **Call Logs:** GET /v1/logs

**Complete Documentation:** API_INTEGRATION_GUIDE.md

---

## Appendix: Database Schema Suggestion

### OTP Sessions Table

```sql
CREATE TABLE otp_sessions (
  id SERIAL PRIMARY KEY,
  session_id UUID UNIQUE NOT NULL,
  phone VARCHAR(15) NOT NULL,
  otp_code VARCHAR(8) NOT NULL,
  user_id VARCHAR(255),
  purpose VARCHAR(50),
  rivoct_request_id UUID,
  call_status VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  expiry_time TIMESTAMP NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  attempts INT DEFAULT 0,
  INDEX idx_session_id (session_id),
  INDEX idx_phone_created (phone, created_at)
);
```

---

**Document End**

This workflow document is specific to Mezzingo's integration with Rivoct Voice OTP API.  
For questions or clarifications, contact support@rivoct.com

*Confidential - For Authorized Use Only*
