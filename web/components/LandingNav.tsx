"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import clsx from "clsx";

export const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-void/80 backdrop-blur-md border-white/10 py-4"
          : "bg-transparent border-transparent py-6"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/assets/logo.svg" 
            alt="Rivoct" 
            className="h-8 w-auto"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-mono text-xs font-medium text-white/70">
          <Link href="#features" className="hover:text-signal transition-colors">CAPABILITIES</Link>
          <Link href="#infrastructure" className="hover:text-signal transition-colors">INFRASTRUCTURE</Link>
          <Link href="#pricing" className="hover:text-signal transition-colors">PRICING</Link>
          <Link href="#docs" className="hover:text-signal transition-colors">DOCS</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="hidden md:inline-flex font-mono text-xs font-bold text-white hover:text-signal transition-colors"
          >
            LOGIN
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-sm bg-white px-5 py-2 font-mono text-xs font-bold text-black transition-all hover:bg-signal hover:text-white"
          >
            GET_API_KEY
          </Link>
        </div>
      </div>
    </header>
  );
};
