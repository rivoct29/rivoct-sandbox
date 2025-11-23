"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import clsx from "clsx";

export const LandingNav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        role="banner"
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          scrolled
            ? "bg-void/80 backdrop-blur-md border-white/10 py-4"
            : "bg-transparent border-transparent py-6"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 xs:px-6">
          <Link 
            href="/" 
            className="flex items-center gap-2"
            aria-label="Rivoct Home"
          >
            <img 
              src="/assets/logo.svg" 
              alt="Rivoct Logo - Enterprise Routing Engine" 
              className="h-7 xs:h-8 w-auto"
            />
          </Link>

          <nav 
            role="navigation" 
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-8 font-mono text-xs font-medium text-white/70"
          >
            <Link 
              href="/features" 
              className="hover:text-signal transition-colors duration-200 touch-target flex items-center"
            >
              Features
            </Link>
            <Link 
              href="/docs" 
              className="hover:text-signal transition-colors duration-200 touch-target flex items-center"
            >
              Docs
            </Link>
            <Link 
              href="/packages" 
              className="hover:text-signal transition-colors duration-200 touch-target flex items-center"
            >
              Pricing
            </Link>
            <Link 
              href="/status" 
              className="hover:text-signal transition-colors duration-200 touch-target flex items-center"
            >
              Status
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden sm:inline-flex btn-standard font-mono text-xs font-bold text-white transition-colors duration-200 touch-target items-center"
              style={{ borderRadius: 'var(--button-radius)' }}
            >
              Login
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center btn-standard bg-signal text-sm font-mono font-bold text-white transition-all duration-200 hover:bg-signal/90 hover:shadow-lg hover:shadow-signal/20 touch-target"
              style={{ borderRadius: 'var(--button-radius)' }}
            >
              Get API Key
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-signal transition-colors touch-target"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 md:hidden bg-void/95 backdrop-blur-lg pt-24"
          onClick={() => setMobileMenuOpen(false)}
        >
          <nav 
            className="flex flex-col items-center gap-8 font-mono text-lg font-medium text-white/70 p-8"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <Link 
              href="/features" 
              className="hover:text-signal transition-colors duration-200 touch-target"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              href="/docs" 
              className="hover:text-signal transition-colors duration-200 touch-target"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link 
              href="/packages" 
              className="hover:text-signal transition-colors duration-200 touch-target"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              href="/status" 
              className="hover:text-signal transition-colors duration-200 touch-target"
              onClick={() => setMobileMenuOpen(false)}
            >
              Status
            </Link>
            <Link 
              href="/login" 
              className="hover:text-signal transition-colors duration-200 touch-target sm:hidden"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
          </nav>
        </div>
      )}
    </>
  );
};
