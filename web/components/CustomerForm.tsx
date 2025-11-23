"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { getFirestoreClient } from "../lib/firebaseClient";
import { GlassCard } from "./ui/GlassCard";

export const CustomerForm = () => {
  const [customerId, setCustomerId] = useState("");
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("sandbox");
  const [status, setStatus] = useState("active");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!customerId) return;
    const firestore = getFirestoreClient();
    await setDoc(doc(firestore, "customers", customerId), {
      name,
      billingPlan: plan,
      status,
      createdAt: serverTimestamp(),
      apiKeyIds: []
    });
    setCustomerId("");
    setName("");
    setMessage("CUSTOMER_PROVISIONED");
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <GlassCard className="p-6">
      <h2 className="mb-6 font-mono text-lg font-bold text-white">PROVISION_TENANT</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="font-mono text-xs uppercase text-mono">Customer ID</label>
          <input
            value={customerId}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerId(e.target.value)}
            className="w-full rounded-none border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            placeholder="ACME_SANDBOX"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="font-mono text-xs uppercase text-mono">Entity Name</label>
          <input
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            className="w-full rounded-none border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-white placeholder-white/20 focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            placeholder="ACME CORP"
            required
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-mono">Billing Plan</label>
            <select
              value={plan}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setPlan(e.target.value)}
              className="w-full rounded-none border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-white focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            >
              <option value="sandbox">SANDBOX</option>
              <option value="paid">ENTERPRISE</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="font-mono text-xs uppercase text-mono">Status</label>
            <select
              value={status}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value)}
              className="w-full rounded-none border border-white/10 bg-black/50 px-4 py-3 font-mono text-sm text-white focus:border-signal focus:outline-none focus:ring-1 focus:ring-signal"
            >
              <option value="active">ACTIVE</option>
              <option value="suspended">SUSPENDED</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="w-full btn-primary transition-all"
        >
          PROVISION_CUSTOMER
        </button>
        {message && <p className="font-mono text-xs text-signal text-center">{message}</p>}
      </form>
    </GlassCard>
  );
};
