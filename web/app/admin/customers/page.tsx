"use client";

import { Nav } from "../../../components/Nav";
import { RequireAuth } from "../../../components/RequireAuth";
import { CustomerForm } from "../../../components/CustomerForm";
import { useCustomers, useIsAdmin } from "../../../lib/hooks";
import { GlassCard } from "../../../components/ui/GlassCard";

export default function AdminCustomersPage() {
  const isAdmin = useIsAdmin();
  const customers = useCustomers(isAdmin);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-void font-sans text-mono selection:bg-signal selection:text-void">
        <Nav />
        <main className="mx-auto max-w-7xl space-y-8 px-6 py-12">
          <div className="border-b border-white/10 pb-6">
            <h1 className="font-mono text-3xl font-bold tracking-tight text-white">
              TENANT_DIRECTORY
            </h1>
            <p className="mt-2 font-mono text-sm text-mono">
              PROVISIONING_AND_LIFECYCLE
            </p>
          </div>

          {!isAdmin ? (
            <div className="border border-alert/20 bg-alert/10 p-4">
              <p className="font-mono text-sm text-alert">
                ACCESS_DENIED: ADMIN_PRIVILEGES_REQUIRED
              </p>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <CustomerForm />
              <GlassCard className="p-6">
                <h2 className="mb-6 font-mono text-lg font-bold text-white">ACTIVE_TENANTS</h2>
                <div className="space-y-3">
                  {customers.data.map((customer) => (
                    <div key={customer.id} className="group border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-signal/50 hover:bg-white/10">
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-sm font-bold text-white group-hover:text-signal">
                          {customer.name.toUpperCase()}
                        </p>
                        <span className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase ${
                          customer.status === 'active' ? 'bg-signal/10 text-signal' : 'bg-alert/10 text-alert'
                        }`}>
                          {customer.status}
                        </span>
                      </div>
                      <p className="mt-1 font-mono text-xs text-mono">ID: {customer.id}</p>
                      <div className="mt-2 flex gap-3 font-mono text-[10px] text-mono">
                        <span>PLAN: {customer.billingPlan.toUpperCase()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}
        </main>
      </div>
    </RequireAuth>
  );
}
