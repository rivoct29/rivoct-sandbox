"use client";

import { type FormEvent, useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthClient } from "../../lib/firebaseClient";
import { GlassCard } from "../../components/ui/GlassCard";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const auth = getAuthClient();
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to authenticate");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-void px-6 font-sans text-mono selection:bg-signal selection:text-void">
      <div className="w-full max-w-md">
        <GlassCard className="p-8">
          <div className="text-center">
            <h1 className="font-mono text-2xl font-bold text-white">RIVOCT_CONSOLE</h1>
            <p className="mt-2 font-mono text-xs text-mono">SECURE_ACCESS_GATEWAY</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-mono">Identity</label>
              <input
                type="email"
                className="w-full rounded-none border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
                placeholder="USER@RIVOCT.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-mono">Credential</label>
              <input
                type="password"
                className="w-full rounded-none border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="border border-alert/20 bg-alert/10 p-3">
                <p className="font-mono text-xs text-alert">ERROR: {error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full border border-signal bg-signal/10 py-3 font-mono text-sm font-bold text-signal hover:bg-signal hover:text-black disabled:opacity-50 transition-all"
            >
              {busy ? "AUTHENTICATING..." : mode === "login" ? "INITIALIZE_SESSION" : "REGISTER_IDENTITY"}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-4 border-t border-white/10 pt-6">
            <button 
              className="font-mono text-xs text-mono hover:text-signal transition-colors"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
            >
              {mode === "login" ? "[ CREATE_NEW_IDENTITY ]" : "[ ACCESS_EXISTING_IDENTITY ]"}
            </button>
            
            <Link href="/" className="font-mono text-xs text-white/20 hover:text-white transition-colors">
              ← RETURN_TO_ROOT
            </Link>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
