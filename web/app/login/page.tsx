"use client";

import { type FormEvent, useState } from "react";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAuthClient, getFirestoreClient } from "../../lib/firebaseClient";
import { GlassCard } from "../../components/ui/GlassCard";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const getFirebaseErrorMessage = (error: any): string => {
    const code = error?.code || "";
    switch (code) {
      case "auth/invalid-email":
        return "Invalid email address format";
      case "auth/user-disabled":
        return "This account has been disabled";
      case "auth/user-not-found":
        return "No account found with this email";
      case "auth/wrong-password":
        return "Incorrect password";
      case "auth/email-already-in-use":
        return "An account with this email already exists";
      case "auth/weak-password":
        return "Password is too weak. Use at least 6 characters";
      case "auth/operation-not-allowed":
        return "Email/password sign-in is not enabled";
      case "auth/invalid-credential":
        return "Invalid email or password";
      case "auth/too-many-requests":
        return "Too many failed attempts. Please try again later";
      case "auth/network-request-failed":
        return "Network error. Please check your connection";
      default:
        return error?.message || "Authentication failed. Please try again";
    }
  };

  const checkExistingUser = async (email: string): Promise<boolean> => {
    try {
      const auth = getAuthClient();
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      return signInMethods.length > 0;
    } catch (error) {
      console.error("Error checking existing user:", error);
      return false;
    }
  };

  const logUserData = async (userId: string, email: string, isNewUser: boolean) => {
    try {
      const firestore = getFirestoreClient();
      const userRef = doc(firestore, "users", userId);
      
      if (isNewUser) {
        // Create new user document with full details
        await setDoc(userRef, {
          uid: userId,
          email: email,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
          loginCount: 1,
          customerId: userId, // Customer ID is same as user ID
          status: "active",
          emailVerified: false,
          metadata: {
            signupMethod: "email",
            userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
            ipAddress: "client-side", // Would need backend to get real IP
          }
        });
        console.log(`[UserLog] New user created: ${email}`);
      } else {
        // Update existing user login info
        const userDoc = await getDoc(userRef);
        const loginCount = userDoc.exists() ? (userDoc.data().loginCount || 0) + 1 : 1;
        
        await setDoc(userRef, {
          lastLoginAt: serverTimestamp(),
          loginCount: loginCount,
        }, { merge: true });
        console.log(`[UserLog] User login: ${email} (count: ${loginCount})`);
      }
    } catch (error) {
      console.error("Error logging user data:", error);
      // Don't throw - logging shouldn't block authentication
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setEmailError(null);
    setPasswordError(null);

    // Validate inputs
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    
    if (!isEmailValid || !isPasswordValid) {
      return;
    }

    // Check terms agreement for signup
    if (mode === "signup" && !agreedToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy to create an account");
      return;
    }

    setBusy(true);
    try {
      const auth = getAuthClient();
      
      if (mode === "login") {
        // Standard login flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await logUserData(userCredential.user.uid, email, false);
        router.push("/dashboard");
      } else {
        // Signup flow - check if user already exists
        const userExists = await checkExistingUser(email);
        
        if (userExists) {
          setError("An account with this email already exists. Please login instead.");
          setMode("login"); // Switch to login mode
          return;
        }

        // Create new user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await logUserData(userCredential.user.uid, email, true);
        router.push("/packages");
      }
    } catch (err) {
      const errorMessage = getFirebaseErrorMessage(err);
      
      // If error indicates existing account, switch to login mode
      if (err && typeof err === "object" && "code" in err && err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
        setMode("login");
      } else {
        setError(errorMessage);
      }
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
                className={`w-full rounded-none border ${emailError ? 'border-alert' : 'border-white/10'} bg-black/50 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal`}
                placeholder="USER@RIVOCT.COM"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) setEmailError(null);
                }}
                onBlur={() => validateEmail(email)}
                required
              />
              {emailError && (
                <p className="font-mono text-xs text-alert">{emailError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="font-mono text-xs uppercase text-mono">Credential</label>
              <input
                type="password"
                className={`w-full rounded-none border ${passwordError ? 'border-alert' : 'border-white/10'} bg-black/50 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal`}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) setPasswordError(null);
                }}
                onBlur={() => validatePassword(password)}
                required
              />
              {passwordError && (
                <p className="font-mono text-xs text-alert">{passwordError}</p>
              )}
              {mode === "signup" && !passwordError && password && (
                <p className="font-mono text-xs text-white/40">Minimum 6 characters required</p>
              )}
            </div>

            {mode === "signup" && (
              <div className="space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-white/10 bg-black/50 text-signal focus:ring-signal focus:ring-offset-0"
                  />
                  <span className="font-mono text-xs text-white/70 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" target="_blank" className="text-signal hover:underline">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link href="/privacy" target="_blank" className="text-signal hover:underline">
                      Privacy Policy
                    </Link>
                    . I understand that my data will be processed as described in these documents.
                  </span>
                </label>
              </div>
            )}

            {error && (
              <div className="border border-alert/20 bg-alert/10 p-3">
                <p className="font-mono text-xs text-alert">ERROR: {error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full btn-primary disabled:opacity-50 transition-all"
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
            
            {mode === "login" && (
              <Link href="/auth/forgot" className="font-mono text-xs text-white/40 hover:text-signal transition-colors">
                [ RESET_PASSWORD ]
              </Link>
            )}
            
            <Link href="/" className="font-mono text-xs text-white/20 hover:text-white transition-colors">
              ← RETURN_TO_ROOT
            </Link>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
