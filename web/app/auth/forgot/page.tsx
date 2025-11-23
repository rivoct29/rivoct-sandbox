"use client";

import { useState } from "react";
import Link from "next/link";
import { getAuthClient } from "../../../lib/firebaseClient";
import { sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const auth = getAuthClient();
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-void border border-white/10 p-8 rounded">
          <div className="h-12 w-12 bg-signal/20 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">✓</span>
          </div>
          <h1 className="font-mono text-2xl font-bold text-white mb-4">CHECK YOUR EMAIL</h1>
          <p className="text-white/60 mb-2">
            Password reset link sent to:
          </p>
          <p className="text-signal font-mono mb-6">{email}</p>
          <p className="text-white/40 text-sm mb-6">
            If you don't see the email, check your spam folder.
          </p>
          <Link 
            href="/login" 
            className="block text-center w-full bg-white/5 border border-white/10 text-white font-mono font-bold py-2 rounded hover:bg-white/10 transition"
          >
            RETURN TO LOGIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-void flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-void border border-white/10 p-8 rounded">
        <h1 className="font-mono text-2xl font-bold text-white mb-2">RESET PASSWORD</h1>
        <p className="text-white/40 text-sm mb-6">
          Enter your email and we'll send you a reset link
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-sm text-white/60 mb-2">EMAIL ADDRESS</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-void border border-white/20 rounded px-4 py-2 text-white focus:border-signal focus:outline-none font-mono"
              required
              disabled={loading}
            />
          </div>
          
          {error && (
            <div className="bg-alert/10 border border-alert/20 rounded p-3">
              <p className="text-alert text-sm font-mono">{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-signal text-void font-mono font-bold py-2 rounded hover:bg-signal/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "SENDING..." : "SEND RESET LINK"}
          </button>
          
          <Link 
            href="/login" 
            className="block text-center text-white/60 hover:text-signal text-sm font-mono transition"
          >
            ← Back to login
          </Link>
        </form>
      </div>
    </div>
  );
}
