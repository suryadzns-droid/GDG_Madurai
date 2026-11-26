"use client";

import React, { useState, useEffect } from "react";
import { GDGLogo } from "./GoogleLogo";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Events", href: "#events" },
    { name: "Community", href: "#community" },
    { name: "Team", href: "#team" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-sans ${
        isScrolled
          ? "bg-black/75 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20 py-3.5"
          : "bg-gradient-to-b from-black/60 via-black/20 to-transparent py-5 sm:py-6"
      }`}
    >
      <div className="max-w-[1300px] mx-auto px-6 sm:px-10 md:px-14 flex items-center justify-between">
        {/* Brand Logo - Enlarged GDG Logo */}
        <a
          href="#"
          className="inline-flex items-center transition-opacity duration-200 hover:opacity-90"
          aria-label="Google Developer Groups Madurai"
        >
          <GDGLogo className="h-9 sm:h-11 md:h-13 w-auto object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" />
        </a>

        {/* Desktop Navigation Links: Home · About · Events · Community · Team · Contact */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[15px] font-medium text-white/90 hover:text-white transition-colors duration-200 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] hover:drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)] relative py-1"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white p-2 rounded-lg bg-black/30 backdrop-blur-sm border border-white/15"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 flex flex-col gap-4 animate-fade-in">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="text-[16px] font-medium text-white/90 hover:text-[#4285F4] py-2 border-b border-white/5 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
