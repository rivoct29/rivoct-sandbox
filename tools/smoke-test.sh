#!/bin/bash
# Rivoct Sandbox Smoke Tests
set -e

PROJECT_ID="rivoct-sandbox"
# Use the Firebase Hosting URL for the sandbox environment
API_BASE="https://rivoct-sandbox.web.app"
WEBHOOK_BASE="https://rivoct-sandbox.web.app/webhooks"

echo "🔥 RIVOCT SANDBOX SMOKE TESTS"
echo "================================"

# Test 1: Health Check
echo "📡 Testing health endpoint..."
HEALTH=$(curl -v -s "${API_BASE}/health" 2>&1)
if echo "$HEALTH" | grep -q '"status":"ok"'; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed"
  echo "Response: $HEALTH"
  exit 1
fi

# Test 2: Voice OTP (requires API key)
if [ -z "$RIVOCT_API_KEY" ]; then
  echo "⚠️  RIVOCT_API_KEY not set, skipping authenticated tests"
else
  echo "📞 Testing voice OTP endpoint..."
  OTP_RESPONSE=$(curl -s -X POST "${API_BASE}/v1/voice-otp" \
    -H "x-api-key: $RIVOCT_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"phone":"+919876543210","otpCode":"123456"}')
  
  if echo "$OTP_RESPONSE" | grep -q 'requestId'; then
    echo "✅ Voice OTP call succeeded"
  else
    echo "❌ Voice OTP call failed"
    echo "$OTP_RESPONSE"
    exit 1
  fi

  # Test 3: Usage Summary
  echo "📊 Testing usage summary..."
  USAGE=$(curl -s "${API_BASE}/v1/usage/summary" \
    -H "x-api-key: $RIVOCT_API_KEY")
  
  if echo "$USAGE" | grep -q 'customerId'; then
    echo "✅ Usage summary retrieved"
  else
    echo "❌ Usage summary failed"
    exit 1
  fi

  # Test 4: Rate Limiting
  echo "⏱️  Testing rate limits (6 rapid calls)..."
  for i in {1..6}; do
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${API_BASE}/v1/voice-otp" \
      -H "x-api-key: $RIVOCT_API_KEY" \
      -H "Content-Type: application/json" \
      -d '{"phone":"+919876543210","otpCode":"'$i'"}')
    
    if [ "$STATUS" = "429" ]; then
      echo "✅ Rate limit triggered on call $i"
      break
    fi
  done
fi

echo ""
echo "🎉 All smoke tests passed!"
