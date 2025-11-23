"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { signOut } from "firebase/auth";
import { getAuthClient } from "../lib/firebaseClient";
import { useIsAdmin } from "../lib/hooks";

const baseLinks = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/logs", label: "Logs" },
  { href: "/settings", label: "Settings" }
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

  const links = isAdmin ? [...baseLinks, { href: "/admin", label: "Admin" }] : baseLinks;

  return (
    <header 
      role="banner"
      className="sticky top-0 z-50 border-b border-white/5 bg-void/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 focus-visible:outline-signal"
          aria-label="Rivoct Dashboard"
        >
          <img 
            src="/assets/logo.svg" 
            alt="Rivoct" 
            className="h-8 w-auto"
          />
        </Link>
        <nav 
          role="navigation"
          aria-label="Dashboard navigation"
          className="flex items-center gap-6 font-mono text-xs"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname?.startsWith(link.href) ? "page" : undefined}
              className={clsx(
                "transition-colors duration-200 hover:text-signal touch-target flex items-center",
                pathname?.startsWith(link.href) ? "text-signal font-bold" : "text-mono"
              )}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={handleSignOut}
            className="rounded border border-white/10 px-3 py-1.5 text-mono transition-all duration-200 hover:border-alert hover:text-alert touch-target"
            aria-label="Sign out"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
};
