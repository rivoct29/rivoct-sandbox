import { Nav } from "../../components/Nav";
import { Footer } from "../../components/Footer";
import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-void">
      <Nav />
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm font-mono text-white/50 mb-8">
          <Link href="/" className="hover:text-signal transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Documentation</span>
        </nav>

        <h1 className="font-mono text-4xl font-bold text-white mb-4">Documentation</h1>
        <p className="text-white/70 mb-12 leading-relaxed">Complete guide to integrating Rivoct Voice OTP</p>
        
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Link href="#quickstart" className="border border-white/10 bg-white/5 p-6 rounded hover:bg-white/10 transition">
            <h2 className="font-mono text-xl font-bold text-white mb-2">🚀 Quick Start</h2>
            <p className="text-white/60 text-sm">Get up and running in 5 minutes</p>
          </Link>

          <Link href="#api" className="border border-white/10 bg-white/5 p-6 rounded hover:bg-white/10 transition">
            <h2 className="font-mono text-xl font-bold text-white mb-2">📡 API Reference</h2>
            <p className="text-white/60 text-sm">Complete endpoint documentation</p>
          </Link>

          <Link href="#examples" className="border border-white/10 bg-white/5 p-6 rounded hover:bg-white/10 transition">
            <h2 className="font-mono text-xl font-bold text-white mb-2">💻 Code Examples</h2>
            <p className="text-white/60 text-sm">Integration samples in multiple languages</p>
          </Link>
        </div>

        <div className="space-y-16 text-white/70">
          <section id="quickstart">
            <h2 className="font-mono text-3xl font-bold text-white mb-6">QUICK START</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-mono text-xl font-bold text-white mb-3">1. Get Your API Key</h3>
                <p className="mb-3">Sign up and navigate to your dashboard to retrieve your API key.</p>
                <Link href="/login" className="inline-block bg-signal text-void font-mono font-bold px-4 py-2 rounded hover:bg-signal/90 transition">
                  GET_API_KEY
                </Link>
              </div>

              <div>
                <h3 className="font-mono text-xl font-bold text-white mb-3">2. Make Your First Request</h3>
                <div className="bg-black/50 border border-white/10 p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre className="text-signal">{`curl -X POST https://api.rivoct.com/v1/voice/otp \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "+919876543210",
    "otpLength": 6,
    "language": "en"
  }'`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xl font-bold text-white mb-3">3. Handle the Response</h3>
                <div className="bg-black/50 border border-white/10 p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre className="text-white/70">{`{
  "success": true,
  "requestId": "req_abc123xyz",
  "status": "initiated",
  "estimatedDelivery": "2025-11-21T10:30:45Z"
}`}</pre>
                </div>
              </div>
            </div>
          </section>

          <section id="api">
            <h2 className="font-mono text-3xl font-bold text-white mb-6">API REFERENCE</h2>
            
            <div className="space-y-8">
              <div className="border border-white/10 bg-white/5 p-6 rounded">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-signal text-void font-mono font-bold px-3 py-1 rounded text-xs">POST</span>
                  <code className="text-signal font-mono">/v1/voice/otp</code>
                </div>
                <p className="mb-4">Send a voice OTP to a phone number</p>
                
                <h4 className="font-mono font-bold text-white mb-2">Request Body</h4>
                <div className="bg-black/50 border border-white/10 p-4 rounded font-mono text-xs overflow-x-auto mb-4">
                  <pre className="text-white/70">{`{
  "phone": "string (required) - E.164 format",
  "otpLength": "number (optional) - Default: 6",
  "language": "string (optional) - Default: 'en'",
  "webhookUrl": "string (optional) - Callback URL"
}`}</pre>
                </div>

                <h4 className="font-mono font-bold text-white mb-2">Response</h4>
                <div className="bg-black/50 border border-white/10 p-4 rounded font-mono text-xs overflow-x-auto">
                  <pre className="text-white/70">{`{
  "success": true,
  "requestId": "string",
  "status": "initiated" | "queued",
  "estimatedDelivery": "ISO 8601 timestamp"
}`}</pre>
                </div>
              </div>

              <div className="border border-white/10 bg-white/5 p-6 rounded">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-white/20 text-white font-mono font-bold px-3 py-1 rounded text-xs">GET</span>
                  <code className="text-signal font-mono">/v1/voice/otp/:requestId</code>
                </div>
                <p className="mb-4">Check the status of a voice OTP request</p>
                
                <h4 className="font-mono font-bold text-white mb-2">Response</h4>
                <div className="bg-black/50 border border-white/10 p-4 rounded font-mono text-xs overflow-x-auto">
                  <pre className="text-white/70">{`{
  "success": true,
  "requestId": "string",
  "status": "answered" | "failed" | "pending",
  "duration": "number (seconds)",
  "attempts": "number"
}`}</pre>
                </div>
              </div>
            </div>
          </section>

          <section id="examples">
            <h2 className="font-mono text-3xl font-bold text-white mb-6">CODE EXAMPLES</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-mono text-xl font-bold text-white mb-3">Node.js</h3>
                <div className="bg-black/50 border border-white/10 p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre className="text-white/70">{`const axios = require('axios');

async function sendVoiceOTP(phone) {
  const response = await axios.post(
    'https://api.rivoct.com/v1/voice/otp',
    { phone, otpLength: 6 },
    { headers: { 'Authorization': \`Bearer \${process.env.RIVOCT_API_KEY}\` }}
  );
  return response.data;
}`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xl font-bold text-white mb-3">Python</h3>
                <div className="bg-black/50 border border-white/10 p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre className="text-white/70">{`import requests
import os

def send_voice_otp(phone):
    response = requests.post(
        'https://api.rivoct.com/v1/voice/otp',
        json={'phone': phone, 'otpLength': 6},
        headers={'Authorization': f'Bearer {os.getenv("RIVOCT_API_KEY")}'}
    )
    return response.json()`}</pre>
                </div>
              </div>

              <div>
                <h3 className="font-mono text-xl font-bold text-white mb-3">cURL</h3>
                <div className="bg-black/50 border border-white/10 p-4 rounded font-mono text-sm overflow-x-auto">
                  <pre className="text-signal">{`curl -X POST https://api.rivoct.com/v1/voice/otp \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"phone": "+919876543210", "otpLength": 6}'`}</pre>
                </div>
              </div>
            </div>
          </section>

          <section id="routing">
            <h2 className="font-mono text-3xl font-bold text-white mb-6">ROUTING ENGINE</h2>
            <p className="mb-4">
              Rivoct's intelligent routing engine automatically selects the best carrier based on real-time performance metrics, geographic location, and historical success rates.
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Automatic primary/secondary carrier selection</li>
              <li>Real-time failover with retry logic</li>
              <li>Geographic optimization for India coverage</li>
              <li>Configurable timeout and retry parameters</li>
            </ul>
          </section>

          <section id="webhooks">
            <h2 className="font-mono text-3xl font-bold text-white mb-6">WEBHOOKS</h2>
            <p className="mb-4">
              Configure webhook URLs to receive real-time delivery status updates.
            </p>
            <div className="bg-black/50 border border-white/10 p-4 rounded font-mono text-sm overflow-x-auto">
              <pre className="text-white/70">{`{
  "requestId": "req_abc123xyz",
  "status": "answered",
  "phone": "+919876543210",
  "duration": 28,
  "timestamp": "2025-11-21T10:31:15Z"
}`}</pre>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
