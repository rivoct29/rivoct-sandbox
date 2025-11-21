# Voice OTP API Reference

## Overview
The Voice OTP API allows you to send one-time passwords via automated voice calls to Indian phone numbers.

---

## API Endpoint

**POST** `/api/voice-otp`

### Authentication
All requests must include an API key in the `X-API-Key` header.

```
X-API-Key: your_api_key_here
```

---

## Request Payload

### Minimum Valid Request
```json
{
  "phone": "+919876543210",
  "otpCode": "1234"
}
```

### Full Request with Metadata
```json
{
  "phone": "+919876543210",
  "otpCode": "123456",
  "metadata": {
    "userId": "user_12345",
    "sessionId": "sess_abc123",
    "purpose": "login",
    "ipAddress": "192.168.1.1"
  }
}
```

### Field Specifications

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | Yes | Indian phone number in E.164 format |
| `otpCode` | string | Yes | OTP code to be delivered via voice call |
| `metadata` | object | No | Custom key-value pairs for tracking purposes |

---

## Field Validation Rules

### Phone Number (`phone`)

**Format Requirements:**
- Must be in E.164 format: `+91XXXXXXXXXX`
- Must start with `+91` (India country code)
- Must contain exactly 10 digits after the country code
- First digit after `+91` must be between 1-9 (cannot start with 0)
- No spaces, dashes, or special characters

**Validation Pattern:**
```regex
^\+91[1-9]\d{9}$
```

**Valid Examples:**
```json
"+919876543210"
"+918123456789"
"+917001234567"
"+916512345678"
```

**Invalid Examples:**
```json
"9876543210"          // Missing country code
"+91 9876543210"      // Contains space
"+91-987-654-3210"    // Contains dashes
"+910876543210"       // Starts with 0
"+9198765432"         // Too few digits
"+9198765432101"      // Too many digits
"919876543210"        // Missing + symbol
```

### OTP Code (`otpCode`)

**Length Constraints:**
- Minimum: 4 characters
- Maximum: 8 characters

**Format:**
- Numeric string (digits 0-9)
- No special characters or letters

**Valid Examples:**
```json
"1234"      // 4 digits
"123456"    // 6 digits (common)
"12345678"  // 8 digits (maximum)
"0000"      // Leading zeros allowed
```

**Invalid Examples:**
```json
"123"       // Too short (less than 4)
"123456789" // Too long (more than 8)
"12AB"      // Contains letters
"12-34"     // Contains special characters
""          // Empty string
```

### Metadata (`metadata`)

**Type:** Object (key-value pairs)

**Requirements:**
- Optional field
- Keys must be strings
- Values can be any JSON-serializable type (string, number, boolean, null, object, array)
- No size limits enforced at API level (reasonable use expected)

**Valid Examples:**
```json
{
  "userId": "user_12345",
  "transactionId": "txn_abc123",
  "timestamp": 1700000000,
  "isNewUser": true,
  "tags": ["login", "mobile"],
  "context": {
    "device": "iOS",
    "version": "1.2.3"
  }
}
```

**Common Use Cases:**
- User identification: `"userId": "12345"`
- Session tracking: `"sessionId": "sess_abc"`
- Purpose tracking: `"purpose": "registration"`
- IP tracking: `"ipAddress": "192.168.1.1"`
- Reference IDs: `"orderId": "order_xyz"`
- Device info: `"device": "Android"`

---

## Response Payload

### Successful Response (201 Created)

```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "durationSeconds": 0,
  "billedAmountInr": 0.85
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `requestId` | string | Unique identifier for this OTP request (UUID v4 format) |
| `status` | string | Current status of the voice call |
| `durationSeconds` | number | Duration of the call in seconds |
| `billedAmountInr` | number | Amount charged for this request in Indian Rupees |

### Status Values

| Status | Description |
|--------|-------------|
| `queued` | Call is queued and will be placed shortly |
| `answered` | Call was answered and OTP was delivered |
| `failed` | Call failed to connect or complete |

**Initial Response:**
- Status is typically `queued` when the request is first created
- `durationSeconds` is `0` for queued calls
- Final status is updated asynchronously and can be retrieved via logs API

---

## Error Responses

All error responses follow a consistent structure with an `error` message, a `code` identifier, and optional `details` for validation errors.

### Error Response Structure

```json
{
  "error": "Human-readable error message",
  "code": "MACHINE_READABLE_ERROR_CODE",
  "details": {
    // Optional: Additional error context
  }
}
```

---

## HTTP Status Codes

| Status Code | Meaning | When It Occurs |
|-------------|---------|----------------|
| **201** | Created | OTP request successfully created and queued |
| **400** | Bad Request | Invalid request payload or business logic error |
| **401** | Unauthorized | Missing, invalid, or revoked API key |
| **429** | Too Many Requests | Rate limit exceeded (per minute, day, or month) |
| **500** | Internal Server Error | Unexpected server error (rare) |

---

## 201 Created - Success Response

**Description:** The OTP request was successfully validated, queued, and will be processed.

```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "queued",
  "durationSeconds": 0,
  "billedAmountInr": 0.85
}
```

**Next Steps:**
- Store the `requestId` for tracking
- The call will be placed asynchronously
- Check logs API for final delivery status

---

## 400 Bad Request Errors

### INVALID_BODY - Validation Errors

**Description:** The request payload failed schema validation.

**Causes:**
- Missing required fields (`phone` or `otpCode`)
- Invalid data types
- OTP code length violations (< 4 or > 8 characters)
- Invalid metadata structure

**Response Example - Missing Required Fields:**
```json
{
  "error": "Invalid payload",
  "code": "INVALID_BODY",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "phone": ["Required"],
      "otpCode": ["Required"]
    }
  }
}
```

**Response Example - OTP Too Short:**
```json
{
  "error": "Invalid payload",
  "code": "INVALID_BODY",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "otpCode": ["String must contain at least 4 character(s)"]
    }
  }
}
```

**Response Example - OTP Too Long:**
```json
{
  "error": "Invalid payload",
  "code": "INVALID_BODY",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "otpCode": ["String must contain at most 8 character(s)"]
    }
  }
}
```

**Response Example - Invalid Phone Type:**
```json
{
  "error": "Invalid payload",
  "code": "INVALID_BODY",
  "details": {
    "formErrors": [],
    "fieldErrors": {
      "phone": ["Expected string, received number"]
    }
  }
}
```

**Troubleshooting:**
1. Verify all required fields are present: `phone` and `otpCode`
2. Ensure `phone` is a string (not a number)
3. Ensure `otpCode` is a string between 4-8 characters
4. Check that `metadata` is an object (if provided)
5. Review the `details.fieldErrors` object for specific field issues

---

### Invalid Phone Format

**Description:** The phone number doesn't match the required Indian phone format.

**Error Code:** `Phone number must be an India (+91) MSISDN with 10 digits`

**Response Example:**
```json
{
  "error": "Unable to process voice OTP",
  "code": "Phone number must be an India (+91) MSISDN with 10 digits"
}
```

**Common Causes:**
- Missing `+91` prefix
- Wrong number of digits (not 10 after country code)
- Contains spaces, dashes, or other formatting
- Starts with 0 after country code
- Not a valid Indian mobile number

**Valid Format:** `+91[1-9]XXXXXXXXX` (exactly 12 characters total)

**Examples:**
```json
// ✅ Valid
"+919876543210"
"+918123456789"

// ❌ Invalid
"9876543210"           // Missing +91
"+91 9876543210"       // Contains space
"+919876543"           // Too few digits
"+910876543210"        // Starts with 0
"+919876543210123"     // Too many digits
```

**Troubleshooting:**
1. Strip all spaces and special characters from phone input
2. Add `+91` prefix if missing
3. Validate the number has exactly 10 digits after `+91`
4. Ensure first digit after `+91` is 1-9 (not 0)
5. Use regex pattern: `^\+91[1-9]\d{9}$`

---

### CUSTOMER_NOT_FOUND

**Description:** The customer ID associated with your API key doesn't exist in the system.

**Response Example:**
```json
{
  "error": "Unable to process voice OTP",
  "code": "CUSTOMER_NOT_FOUND"
}
```

**Common Causes:**
- Customer account was deleted
- Database inconsistency
- API key references non-existent customer

**Troubleshooting:**
1. Contact support with your API key ID
2. Verify your account status
3. Request a new API key if needed
4. This usually indicates a critical account issue

**Action Required:** Contact technical support immediately.

---

### CUSTOMER_INACTIVE

**Description:** Your customer account is suspended and cannot make API calls.

**Response Example:**
```json
{
  "error": "Unable to process voice OTP",
  "code": "CUSTOMER_INACTIVE"
}
```

**Common Causes:**
- Account suspended due to payment issues
- Account suspended for policy violations
- Account manually deactivated
- Subscription expired

**Troubleshooting:**
1. Check your account status in the dashboard
2. Verify payment method and billing status
3. Contact your account manager
4. Review any suspension notices sent to your email
5. Resolve outstanding invoices

**Action Required:** Contact billing or account management to reactivate your account.

---

## 401 Unauthorized Errors

### NO_API_KEY - Missing API Key

**Description:** The `X-API-Key` header is missing from the request.

**Response Example:**
```json
{
  "error": "Missing x-api-key header",
  "code": "NO_API_KEY"
}
```

**Troubleshooting:**
1. Verify the header name is exactly `X-API-Key` (case-insensitive)
2. Ensure the header is included in every request
3. Check for typos in header name
4. Verify your HTTP client is sending headers correctly

**Fix:**
```bash
# ✅ Correct
curl -H "X-API-Key: your_key_here" ...

# ❌ Wrong - missing header
curl -d '{"phone":"+919876543210"}' ...

# ❌ Wrong - typo in header name
curl -H "API-Key: your_key_here" ...
```

---

### API_KEY_NOT_FOUND

**Description:** The provided API key doesn't exist in the system.

**Response Example:**
```json
{
  "error": "Invalid API key",
  "code": "API_KEY_NOT_FOUND"
}
```

**Common Causes:**
- Typo in the API key
- Using an old or deleted API key
- Copying key incorrectly (extra spaces, line breaks)
- Using a test key in production or vice versa

**Troubleshooting:**
1. Copy the API key again from your dashboard
2. Check for leading/trailing whitespace
3. Verify you're using the correct environment key
4. Generate a new API key if needed
5. Ensure the key hasn't been deleted

---

### API_KEY_REVOKED

**Description:** The API key has been revoked and can no longer be used.

**Response Example:**
```json
{
  "error": "Invalid API key",
  "code": "API_KEY_REVOKED"
}
```

**Common Causes:**
- Key was manually revoked for security reasons
- Key was compromised and deactivated
- Key was replaced with a new one
- Administrative action by account owner

**Troubleshooting:**
1. Check your dashboard for active API keys
2. Generate a new API key
3. Update your application with the new key
4. Review security logs for unauthorized access
5. Contact support if the revocation was unexpected

**Action Required:** Generate and deploy a new API key immediately.

---

### API_KEY_INVALID

**Description:** The API key exists but the cryptographic signature is invalid.

**Response Example:**
```json
{
  "error": "Invalid API key",
  "code": "API_KEY_INVALID"
}
```

**Common Causes:**
- API key was corrupted during copy/paste
- Key was modified or truncated
- Character encoding issues
- Database corruption (rare)

**Troubleshooting:**
1. Retrieve a fresh copy of your API key
2. Check for character encoding issues
3. Ensure no line breaks or special characters were added
4. Verify the key length is correct
5. Generate a new key if problem persists

---

### UNAUTHORIZED - Generic Authentication Error

**Description:** Authentication failed but the specific reason is unclear.

**Response Example:**
```json
{
  "error": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```

**Common Causes:**
- Middleware authentication failure
- Missing auth context in request pipeline
- Internal authentication error

**Troubleshooting:**
1. Verify `X-API-Key` header is present
2. Check API key is valid and not revoked
3. Ensure you're hitting the correct endpoint
4. Contact support if issue persists

---

## 429 Rate Limit Errors

Rate limits are enforced at three levels: per minute, per day, and per month.

### RATE_LIMIT_MINUTE_EXCEEDED

**Description:** You've exceeded the maximum number of OTP requests allowed per minute.

**Response Example:**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_MINUTE_EXCEEDED"
}
```

**Default Limit:** 60 requests per minute (may vary by plan)

**Troubleshooting:**
1. Implement request throttling in your application
2. Use a queue system to buffer requests
3. Wait 60 seconds before retrying
4. Consider upgrading your plan for higher limits
5. Check for request loops or bugs causing excessive calls

**Prevention:**
- Implement exponential backoff
- Cache OTP generation for duplicate requests
- Monitor your request rate
- Set up alerts for approaching limits

---

### RATE_LIMIT_DAY_EXCEEDED

**Description:** You've exceeded the maximum number of OTP requests allowed per day.

**Response Example:**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_DAY_EXCEEDED"
}
```

**Default Limit:** 10,000 requests per day (may vary by plan)

**Troubleshooting:**
1. Wait until the next day (resets at 00:00 UTC)
2. Review your usage patterns for anomalies
3. Check for bot traffic or abuse
4. Contact support to upgrade your plan
5. Implement daily usage tracking

**Action Required:** Upgrade your plan if you consistently hit daily limits.

---

### RATE_LIMIT_MONTH_EXCEEDED

**Description:** You've exceeded the maximum number of OTP requests allowed per month.

**Response Example:**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_MONTH_EXCEEDED"
}
```

**Default Limit:** 100,000 requests per month (may vary by plan)

**Troubleshooting:**
1. Wait until the next month (resets on 1st day)
2. Contact sales to upgrade your plan immediately
3. Review historical usage to plan capacity
4. Implement usage monitoring and alerts
5. Consider implementing client-side rate limiting

**Action Required:** Contact sales for emergency quota increase or plan upgrade.

---

## 500 Internal Server Error

**Description:** An unexpected error occurred on the server side.

**Response Example:**
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

**Note:** This error is rare and indicates a server-side issue, not a client error.

**Troubleshooting:**
1. Retry the request after a brief delay
2. Implement exponential backoff (1s, 2s, 4s, 8s)
3. Check status page for known incidents
4. Contact support if error persists
5. Provide `requestId` (if available) to support

**When to Contact Support:**
- Error persists after 3-5 retries
- Multiple requests are failing
- Error occurs consistently for specific inputs

---

## Error Handling Best Practices

### 1. Implement Comprehensive Error Handling

```javascript
async function sendOtpWithErrorHandling(phone, otpCode) {
  try {
    const response = await sendVoiceOtp(phone, otpCode);
    return { success: true, data: response };
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      const errorCode = data.code;
      
      switch (status) {
        case 400:
          if (errorCode === 'INVALID_BODY') {
            // Handle validation errors
            return { 
              success: false, 
              error: 'Invalid input',
              details: data.details 
            };
          } else if (errorCode.includes('Phone number')) {
            // Handle phone format error
            return { 
              success: false, 
              error: 'Invalid phone number format' 
            };
          } else if (errorCode === 'CUSTOMER_INACTIVE') {
            // Handle suspended account
            return { 
              success: false, 
              error: 'Account suspended. Please contact support.' 
            };
          }
          break;
          
        case 401:
          // Handle authentication errors
          return { 
            success: false, 
            error: 'Authentication failed. Check API key.' 
          };
          
        case 429:
          // Handle rate limiting
          if (errorCode === 'RATE_LIMIT_MINUTE_EXCEEDED') {
            return { 
              success: false, 
              error: 'Rate limit exceeded. Please wait a minute.',
              retryAfter: 60 
            };
          }
          break;
          
        case 500:
          // Handle server errors - implement retry logic
          return { 
            success: false, 
            error: 'Service temporarily unavailable',
            shouldRetry: true 
          };
      }
    }
    
    // Network or other errors
    return { 
      success: false, 
      error: 'Network error. Please try again.' 
    };
  }
}
```

### 2. Implement Retry Logic with Exponential Backoff

```javascript
async function sendOtpWithRetry(phone, otpCode, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await sendVoiceOtp(phone, otpCode);
    } catch (error) {
      const isLastAttempt = attempt === maxRetries - 1;
      const isRetryable = error.response?.status === 500 || !error.response;
      
      if (!isRetryable || isLastAttempt) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

### 3. Log Errors for Debugging

```javascript
function logApiError(error, context) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    context,
    status: error.response?.status,
    errorCode: error.response?.data?.code,
    errorMessage: error.response?.data?.error,
    details: error.response?.data?.details,
    requestId: error.response?.data?.requestId,
  };
  
  console.error('Voice OTP API Error:', JSON.stringify(logEntry));
  
  // Send to your logging service
  // logger.error('voice-otp-error', logEntry);
}
```

### 4. Monitor Error Rates

Set up monitoring for:
- Error rate by status code (400, 401, 429, 500)
- Specific error codes (CUSTOMER_INACTIVE, RATE_LIMIT_EXCEEDED)
- Rate limit approach warnings (>80% of limit)
- Authentication failures (potential security issue)

### 5. User-Friendly Error Messages

Map technical errors to user-friendly messages:

| Error Code | User Message |
|------------|--------------|
| `INVALID_BODY` | "Please check your phone number and try again." |
| `Phone number...` | "Please enter a valid Indian mobile number starting with +91." |
| `RATE_LIMIT_MINUTE_EXCEEDED` | "Too many requests. Please wait a minute and try again." |
| `CUSTOMER_INACTIVE` | "Service temporarily unavailable. Please contact support." |
| `NO_API_KEY` / `API_KEY_*` | "Authentication error. Please contact support." |
| `500` | "Service temporarily unavailable. Please try again in a moment." |

---

## Troubleshooting Guide

### Quick Diagnostic Checklist

When encountering errors, check these in order:

1. **Request Format**
   - [ ] Is `Content-Type: application/json` header present?
   - [ ] Is request body valid JSON?
   - [ ] Are all required fields present?

2. **Authentication**
   - [ ] Is `X-API-Key` header present?
   - [ ] Is the API key valid and not revoked?
   - [ ] Are you using the correct environment key?

3. **Phone Number**
   - [ ] Starts with `+91`?
   - [ ] Exactly 10 digits after `+91`?
   - [ ] No spaces, dashes, or special characters?
   - [ ] First digit after `+91` is 1-9?

4. **OTP Code**
   - [ ] Between 4-8 characters?
   - [ ] Only contains digits?
   - [ ] Passed as a string, not a number?

5. **Rate Limits**
   - [ ] Check your current usage in dashboard
   - [ ] Are you implementing request throttling?
   - [ ] Are there any request loops in your code?

6. **Account Status**
   - [ ] Is your account active?
   - [ ] Are there any outstanding invoices?
   - [ ] Have you received any suspension notices?

---

## Getting Help

### Before Contacting Support

Gather this information:
1. **Request ID** (from successful requests or error responses)
2. **Timestamp** of the error (in ISO 8601 format)
3. **Full error response** (JSON)
4. **Request payload** (with sensitive data redacted)
5. **HTTP status code** received
6. **Error code** from the response
7. **Your customer ID** or API key ID (first 8 characters only)

### Support Channels

- **Technical Support:** support@rivoct.com
- **Account Issues:** accounts@rivoct.com
- **Emergency:** For rate limit increases or critical issues

### Response Times

- **Critical Issues** (service down): < 1 hour
- **High Priority** (account suspended): < 4 hours
- **Normal Priority** (general questions): < 24 hours

---

## Complete cURL Examples

### Minimum Request
```bash
curl -X POST https://your-api-endpoint.com/api/voice-otp \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "phone": "+919876543210",
    "otpCode": "1234"
  }'
```

### Full Request with Metadata
```bash
curl -X POST https://your-api-endpoint.com/api/voice-otp \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key_here" \
  -d '{
    "phone": "+919876543210",
    "otpCode": "123456",
    "metadata": {
      "userId": "user_12345",
      "sessionId": "sess_abc123",
      "purpose": "login"
    }
  }'
```

---

## Integration Checklist

Before integrating, ensure:

- [ ] Phone numbers are formatted correctly: `+91XXXXXXXXXX`
- [ ] OTP codes are between 4-8 characters long
- [ ] API key is securely stored and included in `X-API-Key` header
- [ ] Error handling is implemented for validation errors
- [ ] Rate limiting is accounted for in your application logic
- [ ] Request/response logging is in place for debugging
- [ ] `requestId` is stored for tracking and support queries

---

## Common Integration Patterns

### Node.js Example
```javascript
const axios = require('axios');

async function sendVoiceOtp(phone, otpCode, metadata = {}) {
  try {
    const response = await axios.post(
      'https://your-api-endpoint.com/api/voice-otp',
      {
        phone,
        otpCode,
        metadata
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': process.env.RIVOCT_API_KEY
        }
      }
    );
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle API errors
      console.error('API Error:', error.response.data);
    }
    throw error;
  }
}

// Usage
const result = await sendVoiceOtp(
  '+919876543210',
  '123456',
  { userId: 'user_12345', purpose: 'login' }
);
console.log('Request ID:', result.requestId);
```

### Python Example
```python
import requests
import os

def send_voice_otp(phone: str, otp_code: str, metadata: dict = None):
    url = 'https://your-api-endpoint.com/api/voice-otp'
    headers = {
        'Content-Type': 'application/json',
        'X-API-Key': os.getenv('RIVOCT_API_KEY')
    }
    payload = {
        'phone': phone,
        'otpCode': otp_code
    }
    if metadata:
        payload['metadata'] = metadata
    
    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    return response.json()

# Usage
result = send_voice_otp(
    '+919876543210',
    '123456',
    {'userId': 'user_12345', 'purpose': 'login'}
)
print(f"Request ID: {result['requestId']}")
```

---

## Best Practices

1. **Phone Number Validation**: Always validate phone numbers on your end before making API calls
2. **OTP Generation**: Generate secure random OTPs with sufficient entropy
3. **Metadata Usage**: Include relevant tracking information in metadata for debugging
4. **Error Handling**: Implement retry logic for transient failures
5. **Rate Limiting**: Implement client-side throttling to respect API limits
6. **Logging**: Log `requestId` for all requests to facilitate support queries
7. **Security**: Never expose API keys in client-side code or version control

---

## Support

For technical support or questions about the API, please contact your account manager or refer to your client onboarding documentation.
