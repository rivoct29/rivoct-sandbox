# Voice OTP API - Integration Guide

**Version:** 1.0  
**Last Updated:** November 2025

---

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Authentication](#authentication)
4. [API Reference](#api-reference)
5. [Code Examples](#code-examples)
6. [Error Handling](#error-handling)
7. [Testing](#testing)
8. [Best Practices](#best-practices)
9. [FAQ](#faq)
10. [Support](#support)

---

## Overview

The Voice OTP API enables you to deliver one-time passwords (OTPs) to your users via automated voice calls. This guide provides everything you need to integrate the API into your application.

### Key Features
- ✅ Instant voice OTP delivery to Indian mobile numbers
- ✅ RESTful API with JSON payloads
- ✅ Real-time status tracking
- ✅ Comprehensive error handling
- ✅ Rate limiting and quota management

### Base URL
```
https://api-wju6e5vpmq-el.a.run.app
```

---

## Getting Started

### Prerequisites
- API key (provided by your account administrator)
- HTTPS-capable client
- Valid Indian mobile phone numbers for testing

### Quick Start
```bash
curl -X POST https://api-wju6e5vpmq-el.a.run.app/v1/voice-otp \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "otpCode": "123456"
  }'
```

---

## Authentication

### API Key Authentication
All API requests must include your API key in the request header.

**Header Name:** `x-api-key`  
**Format:** String (48 characters)  
**Example:** `xK9mPq2Lv8NcRt4Yw6Zf1Hj3Bd7Sg5UxMnOpQrStUv`

### Security Best Practices
1. **Never expose** API keys in client-side code or public repositories
2. **Store securely** in environment variables or secret managers
3. **Use HTTPS** only - never make API calls over HTTP
4. **Rotate regularly** and revoke unused keys
5. **Monitor usage** for unauthorized access patterns

### Required Headers
```http
x-api-key: YOUR_API_KEY
Content-Type: application/json
```

---

## API Reference

### Send Voice OTP

**Endpoint:** `POST /v1/voice-otp`

**Description:** Initiate a voice call to deliver an OTP code to the specified phone number.

#### Request Payload

| Field | Type | Required | Description | Validation |
|-------|------|----------|-------------|------------|
| `phone` | string | Yes | Recipient's mobile number in E.164 format | Must start with `+91` followed by 10 digits (first digit 1-9) |
| `otpCode` | string | Yes | OTP code to be delivered | 4-8 characters, numeric |
| `metadata` | object | No | Custom key-value pairs for tracking | Any valid JSON object |

#### Request Example (Minimum)
```json
{
  "phone": "+919876543210",
  "otpCode": "123456"
}
```

#### Request Example (With Metadata)
```json
{
  "phone": "+919876543210",
  "otpCode": "654321",
  "metadata": {
    "userId": "user_12345",
    "purpose": "login",
    "sessionId": "sess_abc123",
    "timestamp": "2025-11-21T10:30:00Z"
  }
}
```

#### Response (Success - HTTP 201)
```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "answered",
  "durationSeconds": 12,
  "billedAmountInr": 0.32
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `requestId` | string | Unique identifier for this request (UUID format) |
| `status` | string | Call status: `queued`, `answered`, or `failed` |
| `durationSeconds` | number | Duration of the call in seconds |
| `billedAmountInr` | number | Amount charged in Indian Rupees (INR) |

#### Status Values
- **`queued`** - Call is initiated and pending
- **`answered`** - Call was successfully answered by recipient
- **`failed`** - Call failed to complete

---

### Check Service Health

**Endpoint:** `GET /health`

**Description:** Verify API service availability (no authentication required).

**Response (HTTP 200):**
```json
{
  "status": "ok",
  "region": "asia-south1"
}
```

---

### Get Usage Summary

**Endpoint:** `GET /v1/usage/summary`

**Description:** Retrieve current usage statistics and quota information.

**Authentication:** Required

**Response (HTTP 200):**
```json
{
  "customerId": "customer_xyz",
  "minuteCount": 2,
  "dayCount": 45,
  "monthCount": 523,
  "minuteLimit": 5,
  "dayLimit": 100,
  "monthLimit": 1000,
  "totalCostInr": 167.36,
  "updatedAt": "2025-11-21T10:30:00Z"
}
```

---

### Query Call Logs

**Endpoint:** `GET /v1/logs?limit=50&status=answered`

**Description:** Retrieve historical call logs.

**Authentication:** Required

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 50)
- `status` (optional): Filter by status (`queued`, `answered`, `failed`)

**Response (HTTP 200):**
```json
[
  {
    "id": "log_123",
    "customerId": "customer_xyz",
    "phone": "+919876543210",
    "otpCode": "******",
    "status": "answered",
    "durationSeconds": 12,
    "pricingInr": 0.32,
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2025-11-21T10:25:00Z",
    "deliveredAt": "2025-11-21T10:25:15Z"
  }
]
```

---

## Code Examples

### Node.js / TypeScript
```typescript
import axios from 'axios';

const API_KEY = process.env.VOICE_OTP_API_KEY;
const BASE_URL = 'https://api-wju6e5vpmq-el.a.run.app';

async function sendVoiceOTP(phone: string, otpCode: string, metadata?: Record<string, any>) {
  try {
    const response = await axios.post(
      `${BASE_URL}/v1/voice-otp`,
      {
        phone,
        otpCode,
        metadata
      },
      {
        headers: {
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Success:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('API Error:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Voice OTP failed');
    }
    throw error;
  }
}

// Usage
sendVoiceOTP('+919876543210', '123456', { userId: 'user_123', purpose: 'login' })
  .then(result => console.log('OTP sent, Request ID:', result.requestId))
  .catch(error => console.error('Failed:', error.message));
```

### Python
```python
import os
import requests
from typing import Dict, Optional

API_KEY = os.getenv('VOICE_OTP_API_KEY')
BASE_URL = 'https://api-wju6e5vpmq-el.a.run.app'

def send_voice_otp(phone: str, otp_code: str, metadata: Optional[Dict] = None):
    """Send voice OTP to specified phone number"""
    try:
        response = requests.post(
            f'{BASE_URL}/v1/voice-otp',
            json={
                'phone': phone,
                'otpCode': otp_code,
                'metadata': metadata or {}
            },
            headers={
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
            },
            timeout=30
        )
        response.raise_for_status()
        
        data = response.json()
        print(f"Success! Request ID: {data['requestId']}")
        return data
        
    except requests.exceptions.HTTPError as e:
        error_data = e.response.json() if e.response else {}
        print(f"API Error: {error_data.get('error', 'Unknown error')}")
        raise
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {str(e)}")
        raise

# Usage
try:
    result = send_voice_otp(
        phone='+919876543210',
        otp_code='123456',
        metadata={'userId': 'user_123', 'purpose': 'login'}
    )
    print(f"Billed: ₹{result['billedAmountInr']}")
except Exception as e:
    print(f"Failed to send OTP: {e}")
```

### PHP
```php
<?php
function sendVoiceOTP($phone, $otpCode, $metadata = []) {
    $apiKey = getenv('VOICE_OTP_API_KEY');
    $baseUrl = 'https://api-wju6e5vpmq-el.a.run.app';
    
    $data = [
        'phone' => $phone,
        'otpCode' => $otpCode,
        'metadata' => $metadata
    ];
    
    $ch = curl_init("$baseUrl/v1/voice-otp");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'x-api-key: ' . $apiKey,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode >= 200 && $httpCode < 300) {
        $result = json_decode($response, true);
        echo "Success! Request ID: " . $result['requestId'] . "\n";
        return $result;
    } else {
        $error = json_decode($response, true);
        throw new Exception($error['error'] ?? 'API request failed');
    }
}

// Usage
try {
    $result = sendVoiceOTP(
        '+919876543210',
        '123456',
        ['userId' => 'user_123', 'purpose' => 'login']
    );
    echo "Billed: ₹" . $result['billedAmountInr'] . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
```

### Java
```java
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import com.google.gson.Gson;
import java.util.Map;

public class VoiceOTPClient {
    private static final String API_KEY = System.getenv("VOICE_OTP_API_KEY");
    private static final String BASE_URL = "https://api-wju6e5vpmq-el.a.run.app";
    private static final HttpClient client = HttpClient.newHttpClient();
    private static final Gson gson = new Gson();
    
    public static Map<String, Object> sendVoiceOTP(String phone, String otpCode, Map<String, Object> metadata) throws Exception {
        var requestBody = Map.of(
            "phone", phone,
            "otpCode", otpCode,
            "metadata", metadata != null ? metadata : Map.of()
        );
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/v1/voice-otp"))
            .header("x-api-key", API_KEY)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(gson.toJson(requestBody)))
            .build();
        
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() >= 200 && response.statusCode() < 300) {
            return gson.fromJson(response.body(), Map.class);
        } else {
            throw new RuntimeException("API Error: " + response.body());
        }
    }
    
    public static void main(String[] args) {
        try {
            Map<String, Object> metadata = Map.of(
                "userId", "user_123",
                "purpose", "login"
            );
            
            Map<String, Object> result = sendVoiceOTP("+919876543210", "123456", metadata);
            System.out.println("Success! Request ID: " + result.get("requestId"));
            System.out.println("Billed: ₹" + result.get("billedAmountInr"));
        } catch (Exception e) {
            System.err.println("Failed: " + e.getMessage());
        }
    }
}
```

### cURL
```bash
# Basic request
curl -X POST https://api-wju6e5vpmq-el.a.run.app/v1/voice-otp \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"phone":"+919876543210","otpCode":"123456"}'

# With metadata
curl -X POST https://api-wju6e5vpmq-el.a.run.app/v1/voice-otp \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919876543210",
    "otpCode": "123456",
    "metadata": {
      "userId": "user_123",
      "purpose": "login"
    }
  }'

# Check usage
curl -X GET https://api-wju6e5vpmq-el.a.run.app/v1/usage/summary \
  -H "x-api-key: YOUR_API_KEY"
```

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 201 | Created | Voice OTP request successfully processed |
| 200 | OK | Request successful (for GET endpoints) |
| 400 | Bad Request | Invalid request payload or business logic error |
| 401 | Unauthorized | Authentication failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side issue |

### Error Response Format
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

#### 400 Bad Request
**`INVALID_BODY`** - Schema validation failed
```json
{
  "error": "Invalid payload",
  "code": "INVALID_BODY",
  "details": {
    "fieldErrors": {
      "phone": ["Invalid format"],
      "otpCode": ["String must contain at least 4 character(s)"]
    }
  }
}
```
**Cause:** Missing required fields or invalid field values  
**Fix:** Verify payload matches the API specification

**Invalid Phone Format**
```json
{
  "error": "Unable to process voice OTP",
  "code": "Phone number must be an India (+91) MSISDN with 10 digits"
}
```
**Cause:** Phone number not in correct Indian format  
**Fix:** Use E.164 format: `+91` followed by 10 digits (first digit 1-9)

**`CUSTOMER_INACTIVE`** - Account suspended
```json
{
  "error": "Unable to process voice OTP",
  "code": "CUSTOMER_INACTIVE"
}
```
**Cause:** Your account has been suspended  
**Action:** Contact support to resolve account status

#### 401 Unauthorized
**`NO_API_KEY`** - Missing authentication
```json
{
  "error": "Unauthorized",
  "code": "NO_API_KEY"
}
```
**Cause:** `x-api-key` header not provided  
**Fix:** Include API key in request headers

**`UNAUTHORIZED`** - Invalid API key
```json
{
  "error": "Unauthorized",
  "code": "UNAUTHORIZED"
}
```
**Cause:** API key is invalid, expired, or revoked  
**Fix:** Verify API key is correct and active

#### 429 Too Many Requests
**`RATE_LIMIT_MINUTE_EXCEEDED`**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_MINUTE_EXCEEDED"
}
```
**Cause:** Too many requests in the last minute  
**Fix:** Implement exponential backoff and retry after 60 seconds

**`RATE_LIMIT_DAY_EXCEEDED`**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_DAY_EXCEEDED"
}
```
**Cause:** Daily quota exhausted  
**Fix:** Wait until next day or contact support to increase quota

**`RATE_LIMIT_MONTH_EXCEEDED`**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMIT_MONTH_EXCEEDED"
}
```
**Cause:** Monthly quota exhausted  
**Fix:** Wait until next month or upgrade your plan

#### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "code": "INTERNAL_ERROR"
}
```
**Cause:** Unexpected server-side issue  
**Action:** Retry request with exponential backoff, contact support if persists

### Error Handling Example

```typescript
async function sendOTPWithRetry(phone: string, otpCode: string, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const result = await sendVoiceOTP(phone, otpCode);
      return result; // Success
      
    } catch (error) {
      attempt++;
      
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const code = error.response?.data?.code;
        
        // Don't retry on client errors (except rate limits)
        if (status === 400 || status === 401) {
          console.error('Client error, not retrying:', code);
          throw error;
        }
        
        // Retry on rate limits and server errors
        if (status === 429 || status === 500) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          console.log(`Retry attempt ${attempt} after ${delay}ms`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
}
```

---

## Testing

### Test Environment
Use the same production API endpoint for testing with your actual API key.

### Test Phone Numbers
- Use real Indian mobile numbers that you control
- Format: `+91` followed by 10 digits
- Ensure phone can receive calls for verification

### Test Scenarios

#### 1. Basic Success Case
```json
{
  "phone": "+919876543210",
  "otpCode": "123456"
}
```
**Expected:** HTTP 201 with `requestId` and `status: "answered"`

#### 2. Invalid Phone Format
```json
{
  "phone": "9876543210",
  "otpCode": "123456"
}
```
**Expected:** HTTP 400 with phone format error

#### 3. Short OTP Code
```json
{
  "phone": "+919876543210",
  "otpCode": "12"
}
```
**Expected:** HTTP 400 with validation error

#### 4. Missing API Key
Remove `x-api-key` header  
**Expected:** HTTP 401 with `NO_API_KEY` error

#### 5. Rate Limiting
Send multiple requests rapidly  
**Expected:** HTTP 429 after exceeding minute limit

### Integration Testing Checklist
- [ ] Successful OTP delivery to test number
- [ ] Correct handling of invalid phone formats
- [ ] Proper API key authentication
- [ ] Error handling for all HTTP status codes
- [ ] Rate limit detection and backoff logic
- [ ] Logging of request IDs for tracking
- [ ] Timeout handling (30 seconds recommended)
- [ ] HTTPS-only communication verified

---

## Best Practices

### 1. Security
- **Never hardcode** API keys in source code
- **Use environment variables** or secure vault systems
- **Rotate keys** every 90 days
- **Monitor** for unusual usage patterns
- **Implement** request signing for added security

### 2. Error Handling
- **Always check** HTTP status codes
- **Log request IDs** for debugging and support
- **Implement retry logic** with exponential backoff
- **Handle rate limits** gracefully
- **Display user-friendly** error messages

### 3. Rate Limiting
- **Track** your quota usage via `/v1/usage/summary`
- **Implement** client-side throttling
- **Use queues** for high-volume scenarios
- **Request quota increase** proactively when needed

### 4. Phone Number Validation
- **Validate format** before API call: `/^\+91[1-9]\d{9}$/`
- **Normalize input** by removing spaces, dashes, parentheses
- **Store** phone numbers in E.164 format

### 5. OTP Generation
- **Use cryptographically secure** random generators
- **Length:** 4-6 digits recommended for voice
- **Avoid** sequences (123456) or repeated digits (111111)
- **Expiry:** Set OTP expiry on your end (typically 5-10 minutes)

### 6. Monitoring
- **Log all API calls** with request IDs
- **Track success rates** and failure reasons
- **Monitor latency** and set alerts for degradation
- **Review logs** regularly for anomalies

### 7. User Experience
- **Inform users** that they will receive a voice call
- **Provide alternative** delivery methods (SMS, email)
- **Allow retry** if OTP not received
- **Clear instructions** on how to enter received OTP

---

## FAQ

### Q: What phone number formats are supported?
**A:** Only Indian mobile numbers in E.164 format: `+91` followed by 10 digits (first digit must be 1-9). Example: `+919876543210`

### Q: How long does it take for the call to be delivered?
**A:** Typically 5-15 seconds. The API responds with the current status immediately.

### Q: What happens if the call is not answered?
**A:** The status will be `failed`. You can retry or use an alternative delivery method.

### Q: Are there any rate limits?
**A:** Yes, rate limits apply per minute, day, and month based on your account plan. Check your current usage with `GET /v1/usage/summary`.

### Q: Can I customize the voice message?
**A:** Currently, the voice message format is standardized. Contact support for custom requirements.

### Q: How do I track OTP delivery?
**A:** Save the `requestId` from the API response and use `GET /v1/logs` to query delivery status and details.

### Q: What if my API key is compromised?
**A:** Contact support immediately to revoke the key and issue a new one.

### Q: Can I use this for international numbers?
**A:** Currently only Indian numbers (+91) are supported.

### Q: What's the pricing model?
**A:** You're charged per successful voice OTP delivery. Check your contract or contact your account manager for pricing details.

### Q: How do I increase my rate limits?
**A:** Contact your account manager or support team to discuss quota increases based on your usage needs.

---

## Support

### Getting Help
- **Email:** support@rivoct.com
- **Documentation:** (this guide)
- **Status Page:** Check service health at `GET /health`

### When Contacting Support
Please provide:
1. Your customer ID
2. Request ID(s) from failed calls
3. Timestamp of the issue
4. Error messages received
5. Sample request payload (without sensitive data)
6. Your application's environment (language, framework, version)

### SLA
- **Uptime:** 99.9%
- **Support Response:** Within 24 hours
- **Critical Issues:** Within 4 hours

---

## Appendix

### API Endpoint Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/health` | GET | No | Service health check |
| `/v1/voice-otp` | POST | Yes | Send voice OTP |
| `/v1/usage/summary` | GET | Yes | Get usage stats |
| `/v1/logs` | GET | Yes | Query call logs |

### Rate Limits (Default)
- **Per Minute:** 5 requests
- **Per Day:** 100 requests
- **Per Month:** 1000 requests

*Contact your account manager for custom limits*

### Phone Number Regex
```regex
^\+91[1-9]\d{9}$
```

### OTP Code Constraints
- **Length:** 4-8 characters
- **Format:** Numeric (0-9)
- **Recommendation:** 6 digits

---

**End of Integration Guide**

For the latest updates and additional resources, please contact your account manager or visit our support portal.

*This document is confidential and intended for authorized integrators only.*
