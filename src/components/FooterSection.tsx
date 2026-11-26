"use client";

import React from "react";
import { GDGLogo } from "./GoogleLogo";

export function FooterSection() {
  const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Events", href: "#events" },
    { name: "Community", href: "#community" },
    { name: "Team", href: "#team" },
    { name: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    {
      name: "X / Twitter",
      href: "https://x.com/gdgmadurai",
      hoverColor: "hover:text-[#4285F4]",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      href: "https://linkedin.com/company/gdgmadurai",
      hoverColor: "hover:text-[#4285F4]",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      name: "Instagram",
      href: "https://instagram.com/gdgmadurai",
      hoverColor: "hover:text-[#EA4335]",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com/@gdgmadurai",
      hoverColor: "hover:text-[#EA4335]",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: "GitHub",
      href: "https://github.com/gdgmadurai",
      hoverColor: "hover:text-[#202124]",
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
    },
  ];

  return (
    <footer
      id="contact"
      className="relative w-full bg-white font-sans pt-6 sm:pt-8 md:pt-10 pb-10 sm:pb-12 overflow-hidden select-none border-t border-[#F1F3F4] scroll-mt-20"
      aria-label="GDG Madurai Footer"
    >
      {/* --------------------------------------------------------- */}
      {/* JALLIKATTU CULTURAL HERITAGE BACKDROP (MADURAI IDENTITY)  */}
      {/* --------------------------------------------------------- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Authentic Madurai Jallikattu Bull Taming Photograph (Alanganallur) */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-no-repeat pointer-events-none bg-[center_40%] md:bg-[58%_42%]"
          style={{
            backgroundImage: "url('/images/jallikattu.jpg')",
            filter: "contrast(1.10) saturate(0.96)",
            opacity: 0.82,
          }}
        />

        {/* Layer 1: Soft White Horizontal Gradient Wash for Crisp Typography Readability */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, #ffffff 0%, rgba(255, 255, 255, 0.96) 24%, rgba(255, 255, 255, 0.65) 50%, rgba(255, 255, 255, 0.32) 74%, rgba(255, 255, 255, 0.72) 100%)",
          }}
        />

        {/* Layer 2: Subtle Vertical Vignette to Seamlessly Fade Top & Bottom Edges into White */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.35) 18%, transparent 40%, transparent 68%, rgba(255, 255, 255, 0.5) 85%, #ffffff 100%)",
          }}
        />
      </div>

      <div className="w-[92%] sm:w-[88%] md:w-[84%] max-w-[1280px] mx-auto relative z-10">
        {/* --------------------------------------------------------- */}
        {/* 1. TOP AREA: LOGO & MINIMAL NAV LINKS                     */}
        {/* --------------------------------------------------------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 sm:pb-12 border-b border-[#F1F3F4]/80">
          {/* Left: GDG Madurai Logo */}
          <a
            href="#"
            className="inline-flex items-center transition-opacity duration-200 hover:opacity-85 self-start"
            aria-label="Google Developer Groups Madurai Home"
          >
            <GDGLogo
              variant="dark"
              className="h-9 sm:h-10 md:h-11 w-auto object-contain"
            />
          </a>

          {/* Right: Minimal Navigation Links */}
          <nav
            aria-label="Footer Navigation"
            className="flex flex-wrap items-center gap-x-6 sm:gap-x-8 gap-y-3"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-[14px] sm:text-[15px] font-medium text-[#5F6368] hover:text-[#4285F4] transition-colors duration-200 tracking-tight"
              >
                {link.name}
              </a>
            ))}
          </nav>
        </div>

        {/* --------------------------------------------------------- */}
        {/* 2. MIDDLE AREA: STATEMENT & SOCIAL PLATFORM ICONS        */}
        {/* --------------------------------------------------------- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 sm:py-10">
          {/* Subtle closing community statement */}
          <p className="text-[16px] sm:text-[18px] text-[#5F6368] font-normal tracking-tight">
            Building together. Growing together.
          </p>

          {/* Minimal social icons with subtle hover interactions */}
          <div className="flex items-center gap-4 sm:gap-5">
            {socialLinks.map((platform) => (
              <a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={platform.name}
                className={`w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm border border-[#E8EAED] flex items-center justify-center text-[#5F6368] ${platform.hoverColor} hover:border-black/15 transition-all duration-200 hover:scale-110 active:scale-95 shadow-xs`}
              >
                {platform.icon}
              </a>
            ))}
          </div>
        </div>

        {/* --------------------------------------------------------- */}
        {/* 3. BOTTOM AREA: COPYRIGHT & LOCATION CREDIT               */}
        {/* --------------------------------------------------------- */}
        <div className="pt-6 sm:pt-8 border-t border-[#F1F3F4]/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[13px] sm:text-[14px] text-[#80868B]">
          <p>© 2026 Google Developer Groups Madurai.</p>
          <p className="flex items-center gap-1.5">
            <span>Made with</span>
            <span className="text-[#EA4335] text-[15px] animate-pulse leading-none" aria-label="love">
              ♥
            </span>
            <span>in Madurai.</span>
          </p>
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* 4. SIGNATURE GOOGLE 4-COLOR AMBIENT LIGHTING EFFECT       */}
      {/* --------------------------------------------------------- */}
      {/* Natural, curved ambient illumination emerging from bottom edge (No boxy shape) */}
      <div
        className="footer-ambient-glow absolute bottom-0 left-0 right-0 h-44 sm:h-56 pointer-events-none z-0 overflow-hidden"
        style={{
          animation: "footerGlowBreathe 18s ease-in-out infinite",
          willChange: "transform, opacity",
        }}
        aria-hidden="true"
      >
        {/* Natural Curved Ambient Uplight Dome (parabolic arc, zero straight lines) */}
        <div
          className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[110vw] max-w-[1400px] h-[340px] pointer-events-none rounded-[100%]"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 100%, rgba(66, 133, 244, 0.25) 0%, rgba(234, 67, 53, 0.2) 28%, rgba(251, 188, 4, 0.22) 55%, rgba(52, 168, 83, 0.18) 75%, transparent 100%)",
            filter: "blur(60px)",
          }}
        />

        {/* 4 Softly Blended Radial Ambient Color Glows along the curved bottom edge */}
        {/* Blue (Left) */}
        <div
          className="absolute -bottom-10 left-[18%] w-[28vw] h-[180px] max-w-[360px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(66, 133, 244, 0.32) 0%, rgba(66, 133, 244, 0.08) 50%, transparent 75%)",
            filter: "blur(50px)",
          }}
        />

        {/* Red (Center-Left) */}
        <div
          className="absolute -bottom-10 left-[38%] w-[28vw] h-[180px] max-w-[360px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(234, 67, 53, 0.28) 0%, rgba(234, 67, 53, 0.07) 50%, transparent 75%)",
            filter: "blur(50px)",
          }}
        />

        {/* Yellow (Center-Right) */}
        <div
          className="absolute -bottom-10 left-[58%] w-[28vw] h-[180px] max-w-[360px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(251, 188, 4, 0.32) 0%, rgba(251, 188, 4, 0.08) 50%, transparent 75%)",
            filter: "blur(50px)",
          }}
        />

        {/* Green (Right) */}
        <div
          className="absolute -bottom-10 left-[78%] w-[28vw] h-[180px] max-w-[360px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(52, 168, 83, 0.28) 0%, rgba(52, 168, 83, 0.07) 50%, transparent 75%)",
            filter: "blur(50px)",
          }}
        />
      </div>
    </footer>
  );
}
