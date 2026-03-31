"use client";

import { useState } from "react";
import Link from "next/link";

const HUBSPOT_LINK =
  "https://meetings-eu1.hubspot.com/vlad-calus/round-robin-consultanta";
const CARTE_LINK =
  "https://carturesti.ro/carte/independenta-financiara-in-7-pasi-3211453017";

export function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-cream/80 backdrop-blur-md border-b border-border">
      <div className="mx-auto max-w-[1080px] px-5 flex items-center justify-between h-16">
        {/* Logo */}
        <Link
          href="/"
          className="font-heading text-2xl text-burgundy tracking-tight"
        >
          Minimalistu
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/instrumente"
            className="text-sm font-medium text-text hover:text-burgundy transition-colors"
          >
            Instrumente
          </Link>
          <a
            href={CARTE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-text hover:text-burgundy transition-colors"
          >
            Carte{" "}
            <span className="text-text-muted text-xs">↗</span>
          </a>
          <a
            href={HUBSPOT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-5 py-2 bg-burgundy text-white text-sm font-semibold rounded-lg hover:bg-burgundy-light transition-colors"
          >
            Programează o consultanță →
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-text transition-transform ${open ? "rotate-45 translate-y-2" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-text transition-opacity ${open ? "opacity-0" : ""}`}
          />
          <span
            className={`block w-5 h-0.5 bg-text transition-transform ${open ? "-rotate-45 -translate-y-2" : ""}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream border-t border-border px-5 py-4 flex flex-col gap-4">
          <Link
            href="/instrumente"
            onClick={() => setOpen(false)}
            className="text-sm font-medium text-text"
          >
            Instrumente
          </Link>
          <a
            href={CARTE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-text"
          >
            Carte ↗
          </a>
          <a
            href={HUBSPOT_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-5 py-3 bg-burgundy text-white text-sm font-semibold rounded-lg"
          >
            Programează o consultanță →
          </a>
        </div>
      )}
    </nav>
  );
}
