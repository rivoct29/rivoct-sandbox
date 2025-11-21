"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { signOut } from "firebase/auth";
import { getAuthClient } from "../lib/firebaseClient";
import { useIsAdmin } from "../lib/hooks";

const baseLinks = [
  { href: "/dashboard", label: "DASHBOARD" },
  { href: "/logs", label: "LOGS" },
  { href: "/settings", label: "SETTINGS" }
];

export const Nav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = useIsAdmin();

  const handleSignOut = async () => {
    const auth = getAuthClient();
    await signOut(auth);
    router.push("/login");
  };

  const links = isAdmin ? [...baseLinks, { href: "/admin/customers", label: "ADMIN" }] : baseLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-void/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <img 
            src="/assets/logo.svg" 
            alt="Rivoct" 
            className="h-8 w-auto"
          />
        </Link>
        <nav className="flex items-center gap-6 font-mono text-xs">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "transition-colors hover:text-signal",
                pathname?.startsWith(link.href) ? "text-signal" : "text-mono"
              )}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="rounded border border-white/10 px-3 py-1 text-mono transition-all hover:border-alert hover:text-alert"
          >
            DISCONNECT
          </button>
        </nav>
      </div>
    </header>
  );
};
