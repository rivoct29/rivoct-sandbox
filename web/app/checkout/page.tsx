"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAuthClient } from "../../lib/firebaseClient";
import { onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";
import Link from "next/link";

interface PackageDetails {
  id: string;
  name: string;
  monthlyBase: number;
  pricePerMinute: number;
  includedMinutes: number;
}

const packageMap: Record<string, PackageDetails> = {
  basic: {
    id: "basic",
    name: "RIVOCT_BASIC",
    monthlyBase: 999,
    pricePerMinute: 0.40,
    includedMinutes: 5000
  },
  premium: {
    id: "premium",
    name: "RIVOCT_PREMIUM",
    monthlyBase: 4999,
    pricePerMinute: 0.35,
    includedMinutes: 20000
  },
  ultra: {
    id: "ultra",
    name: "RIVOCT_ULTRA",
    monthlyBase: 14999,
    pricePerMinute: 0.30,
    includedMinutes: 75000
  }
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const packageId = searchParams?.get("package") || "basic";
  
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState<string | null>(null);

  const selectedPackage = packageMap[packageId] || packageMap.basic;
  
  // UPI ID (encrypted in production via env variable)
  const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "shahsdha111-1@okaxis";

  useEffect(() => {
    const auth = getAuthClient();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push("/login");
      } else {
        setUser(currentUser);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handlePaymentComplete = async () => {
    if (!transactionId.trim()) {
      setError("Please enter your transaction/reference ID");
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Call Firebase Functions callable to verify payment and activate package
      const functions = getFunctions(undefined, "asia-south1");
      const verifyPayment = httpsCallable(functions, "verifyPaymentAndActivate");

      const res = await verifyPayment({
        userId: user.uid,
        packageId: selectedPackage.id,
        transactionId: transactionId.trim(),
        amount: selectedPackage.monthlyBase
      });

      const result: any = res?.data;

      if (result && result.success) {
        setPaymentVerified(true);
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard?welcome=true");
        }, 2000);
      } else {
        setError((result && result.error) || "Payment verification failed. Please contact support.");
      }
    } catch (err: any) {
      setError("Network error. Please try again or contact support.");
    } finally {
      setProcessing(false);
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    alert("UPI ID copied to clipboard!");
  };

  const openGooglePay = () => {
    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=Rivoct%20Technologies&am=${selectedPackage.monthlyBase}&cu=INR&tn=Rivoct%20${selectedPackage.name}`;
    window.location.href = upiUrl;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-mono text-white font-mono">LOADING_CHECKOUT...</div>
      </div>
    );
  }

  if (paymentVerified) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center px-6">
        <div className="max-w-md w-full border border-signal bg-signal/5 p-8 text-center">
          <div className="w-16 h-16 bg-signal/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h2 className="font-mono text-2xl font-bold text-white mb-4">PAYMENT_VERIFIED</h2>
          <p className="text-white/60 mb-6">
            Your {selectedPackage.name} subscription is now active. Redirecting to dashboard...
          </p>
          <div className="animate-pulse text-signal font-mono text-sm">ACTIVATING_ACCOUNT...</div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-void text-primary selection:bg-signal selection:text-white px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/packages" className="inline-flex items-center gap-2 text-white/60 hover:text-signal transition-colors font-mono text-sm mb-8">
          <span>←</span> BACK_TO_PACKAGES
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div>
            <h1 className="font-mono text-3xl font-bold text-white mb-8">CHECKOUT</h1>
            
            <div className="border border-white/10 bg-white/[0.02] p-6 mb-6">
              <h2 className="font-mono font-bold text-white mb-4 text-sm tracking-wider">ORDER_SUMMARY</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <div>
                    <div className="font-mono font-bold text-white">{selectedPackage.name}</div>
                    <div className="text-sm text-white/60 mt-1">Monthly subscription</div>
                  </div>
                  <div className="font-mono font-bold text-white text-xl">
                    ₹{selectedPackage.monthlyBase.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Included minutes</span>
                    <span className="font-mono">{selectedPackage.includedMinutes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Overage rate</span>
                    <span className="font-mono">₹{selectedPackage.pricePerMinute.toFixed(2)}/min</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Billing cycle</span>
                    <span className="font-mono">Monthly</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/10">
                  <span className="font-mono font-bold text-white">TOTAL_DUE_TODAY</span>
                  <span className="font-mono font-bold text-signal text-2xl">
                    ₹{selectedPackage.monthlyBase.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-signal/20 bg-signal/5 p-4 text-sm">
              <div className="flex gap-2">
                <span className="text-signal flex-shrink-0">ℹ</span>
                <p className="text-white/70">
                  Your subscription will auto-renew monthly. Cancel anytime from your dashboard with no penalties.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Interface */}
          <div>
            <div className="border border-white/10 bg-white/[0.02] p-6">
              <h2 className="font-mono font-bold text-white mb-6 text-sm tracking-wider">PAYMENT_METHOD</h2>

              {error && (
                <div className="mb-6 border border-alert/20 bg-alert/10 p-4 text-sm text-alert">
                  {error}
                </div>
              )}

              {/* Google Pay Option */}
              <div className="mb-6">
                <button
                  onClick={openGooglePay}
                  className="w-full border border-white/20 bg-white/5 hover:bg-white/10 p-4 transition-all flex items-center justify-center gap-3 group"
                >
                  <svg className="w-6 h-6" viewBox="0 0 512 512" fill="currentColor">
                    <path d="M473.16 221.48l-2.26-9.59H262.46v88.22H387c-12.93 61.4-72.93 93.72-121.94 93.72-35.66 0-73.25-15-98.13-39.11a140.08 140.08 0 01-41.8-98.88c0-37.16 16.7-74.33 41-98.78s61-38.13 97.49-38.13c41.79 0 71.74 22.19 82.94 32.31l62.69-62.36C390.86 72.72 340.34 32 261.6 32c-60.75 0-119 23.27-161.58 65.71C58 139.5 36.25 199.93 36.25 256s20.58 113.48 61.3 155.6c43.51 44.92 105.13 68.4 168.58 68.4 57.73 0 112.45-22.62 151.45-63.66 38.34-40.4 58.17-96.3 58.17-154.9 0-24.67-2.48-39.32-2.59-39.96z"/>
                  </svg>
                  <span className="font-mono font-bold text-white">PAY_WITH_GOOGLE_PAY</span>
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/[0.02] text-white/40 font-mono">OR_PAY_MANUALLY</span>
                </div>
              </div>

              {/* Manual UPI Payment */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold text-white mb-2 tracking-wider">
                    STEP_1: PAY_VIA_UPI
                  </label>
                  <div className="border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/60 font-mono">UPI_ID</span>
                      <button
                        onClick={handleCopyUPI}
                        className="text-xs text-signal hover:text-signal/80 font-mono"
                      >
                        [COPY]
                      </button>
                    </div>
                    <div className="font-mono text-white break-all">{UPI_ID}</div>
                    <div className="mt-3 text-xs text-white/60">
                      Amount: <span className="text-signal font-bold">₹{selectedPackage.monthlyBase}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="txnId" className="block text-xs font-mono font-bold text-white mb-2 tracking-wider">
                    STEP_2: ENTER_TRANSACTION_ID
                  </label>
                  <input
                    id="txnId"
                    type="text"
                    placeholder="e.g., 432947238947"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full border border-white/10 bg-white/5 px-4 py-3 font-mono text-sm text-white placeholder-white/30 focus:border-signal focus:outline-none"
                  />
                  <p className="mt-2 text-xs text-white/50">
                    Find this in your Google Pay transaction history
                  </p>
                </div>

                <button
                  onClick={handlePaymentComplete}
                  disabled={processing || !transactionId.trim()}
                  className="w-full bg-signal text-white font-mono font-bold py-4 hover:bg-signal/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {processing ? "VERIFYING_PAYMENT..." : "COMPLETE_PURCHASE"}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-xs text-white/40 text-center">
                <p>Secure payment processing. Your transaction details are encrypted.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Support */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/50 font-mono">
            Need help? <Link href="/contact" className="text-signal hover:underline">CONTACT_SUPPORT</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="text-mono text-white font-mono">LOADING...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
