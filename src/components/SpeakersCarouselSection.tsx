"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SPEAKERS, Speaker } from "@/data/speakersData";

export function SpeakersCarouselSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const startXRef = useRef(0);
  const lastXRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const touchStartXRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const N = SPEAKERS.length;

  const nextSpeaker = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % N);
  }, [N]);

  const prevSpeaker = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + N) % N);
  }, [N]);

  // Automatic Looping Carousel on desktop (every 2.5s, pauses on hover or drag)
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    if (isDragging || isHovered) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % N);
    }, 2500);

    return () => clearInterval(timer);
  }, [isDragging, isHovered, N]);

  // Keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const inView =
        rect.top < window.innerHeight * 0.85 && rect.bottom > window.innerHeight * 0.15;

      if (!inView) return;

      if (e.key === "ArrowRight") {
        nextSpeaker();
      } else if (e.key === "ArrowLeft") {
        prevSpeaker();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSpeaker, prevSpeaker]);

  // Pointer drag gestures (mouse + touch)
  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 1);
    const dx = currentX - lastXRef.current;

    velocityRef.current = dx / dt;
    lastXRef.current = currentX;
    lastTimeRef.current = now;

    setDragX(currentX - startXRef.current);
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture was already released
    }

    const finalDrag = dragX;
    const velocity = velocityRef.current;
    setDragX(0);

    const distanceThreshold = 65;
    const velocityThreshold = 0.35;

    if (finalDrag < -distanceThreshold || velocity < -velocityThreshold) {
      nextSpeaker();
    } else if (finalDrag > distanceThreshold || velocity > velocityThreshold) {
      prevSpeaker();
    }
  };

  return (
    <section
      id="speakers"
      ref={containerRef}
      className="relative w-full bg-white font-sans pt-10 sm:pt-14 md:pt-18 pb-12 sm:pb-16 overflow-hidden select-none scroll-mt-20 sm:scroll-mt-24"
      aria-label="GDG Madurai Speakers Section"
      onMouseEnter={() => {
        if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
          setIsHovered(true);
        }
      }}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* --------------------------------------------------------- */}
      {/* 1. SECTION HEADER (TITLE ON LEFT, CTA ON RIGHT)           */}
      {/* --------------------------------------------------------- */}
      <div className="w-[94%] sm:w-[90%] md:w-[85%] max-w-[1280px] mx-auto mb-6 sm:mb-8 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
        {/* Left Side: Title & Subtitle */}
        <div className="text-left max-w-[620px]">
          <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.08em] text-[#4285F4] uppercase bg-[#4285F4]/8 px-3.5 py-1.5 rounded-full border border-[#4285F4]/15 inline-block mb-2 sm:mb-3">
            Google Developer Groups Madurai 2026
          </span>
          <h2
            className="text-[#202124] font-semibold tracking-tight text-left"
            style={{
              fontSize: "clamp(34px, 5vw, 54px)",
              lineHeight: 1.12,
              letterSpacing: "-0.035em",
            }}
          >
            Meet Our Speakers
          </h2>
          <p className="mt-2 text-[15px] sm:text-[17px] font-normal text-[#5F6368] leading-relaxed">
            Learn from the people building what’s next.
          </p>
        </div>

        {/* Right Side: Straight opposite prompt & animated button */}
        <div className="flex flex-col items-start md:items-end justify-end gap-2.5 shrink-0">
          <p className="text-[14px] sm:text-[15px] font-medium text-[#5F6368] tracking-tight">
            Have a story worth sharing?
          </p>
          <a
            href="#call-for-speakers"
            className="google-gradient-border-btn group"
            aria-label="Take the stage. Become a speaker."
          >
            {/* Animated Conic Glow Layer */}
            <span className="google-gradient-border-beam-glow" />
            {/* Animated Conic Border Beam */}
            <span className="google-gradient-border-beam" />
            {/* Button Inner Body - Fill Color Black */}
            <span className="relative z-10 flex items-center gap-2.5 px-6 sm:px-7 py-2.5 sm:py-3 rounded-full bg-[#131314] text-white text-[14px] sm:text-[15px] font-medium tracking-tight group-hover:bg-black transition-colors shadow-sm">
              <span className="text-white">Take the stage. Become a speaker.</span>
              <svg
                className="w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </a>
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* 2A. MOBILE CLEAN CARD VIEW (< 768px)                       */}
      {/* --------------------------------------------------------- */}
      <div
        className="block md:hidden relative w-full px-4 py-2 touch-pan-y"
        onTouchStart={(e) => {
          touchStartXRef.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchStartXRef.current;
          if (dx < -45) nextSpeaker();
          if (dx > 45) prevSpeaker();
        }}
      >
        <div className="relative w-full max-w-[340px] h-[460px] mx-auto rounded-[28px] overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-[#E8EAED] bg-[#1a1a1a]">
          {/* Active Speaker Image */}
          <img
            src={SPEAKERS[activeIndex].image}
            alt={SPEAKERS[activeIndex].name}
            className="absolute inset-0 w-full h-full object-cover object-center select-none"
            loading="eager"
          />

          {/* Frosted Glass & Atmospheric Ambient Base */}
          <div className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none rounded-b-[28px] overflow-hidden flex flex-col justify-end">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.82) 45%, rgba(15, 23, 42, 0.25) 82%, transparent 100%)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
              }}
            />
            <div
              className="absolute inset-0 opacity-45 mix-blend-color-dodge"
              style={{
                background: `radial-gradient(ellipse at bottom, ${
                  SPEAKERS[activeIndex].ambientColor || "rgba(66, 133, 244, 0.45)"
                } 0%, transparent 80%)`,
              }}
            />
          </div>

          {/* Speaker Details */}
          <div className="relative z-10 w-full h-full p-6 flex flex-col justify-end text-left select-none">
            <h3
              className="text-[24px] font-semibold text-white tracking-tight leading-tight"
              style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.6)" }}
            >
              {SPEAKERS[activeIndex].name}
            </h3>
            <p
              className="text-[14px] font-medium text-white/90 leading-snug mt-1"
              style={{ textShadow: "0 1px 6px rgba(0, 0, 0, 0.4)" }}
            >
              {SPEAKERS[activeIndex].designation}
            </p>
            <p
              className="text-[13px] font-normal text-white/80 leading-relaxed mt-2 line-clamp-3"
              style={{ textShadow: "0 1px 6px rgba(0, 0, 0, 0.4)" }}
            >
              {SPEAKERS[activeIndex].topic}
            </p>
          </div>
        </div>

        {/* Mobile Pagination Indicator Pills */}
        <div className="flex items-center justify-center gap-2 mt-4">
          {SPEAKERS.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveIndex(idx)}
              aria-label={`Speaker ${idx + 1}: ${s.name}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-7 bg-[#4285F4]"
                  : "w-2 bg-[#DADCE0] hover:bg-[#BDC1C6]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* 2B. 3D INTERACTIVE CAROUSEL STAGE FOR DESKTOP (>= 768px)  */}
      {/* --------------------------------------------------------- */}
      <div
        className="hidden md:flex relative w-full h-[580px] sm:h-[640px] md:h-[690px] items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y"
        style={{
          perspective: "1300px",
          perspectiveOrigin: "center center",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="relative w-[310px] sm:w-[360px] md:w-[420px] h-[430px] sm:h-[495px] md:h-[570px] flex items-center justify-center [--speaker-spacing:230px] sm:[--speaker-spacing:285px] md:[--speaker-spacing:335px]"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {SPEAKERS.map((speaker: Speaker, index: number) => {
            // Circular offset relative to active card
            const diff = index - activeIndex;
            let offset = ((diff % N) + N) % N;
            if (offset > N / 2) offset -= N;

            // Fluid drag offset interpolation
            const cardWidth = 420;
            const dragFraction = isDragging ? dragX / cardWidth : 0;
            const effectiveOffset = offset + dragFraction;

            const isCenter = Math.abs(effectiveOffset) < 0.45;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            // Responsive 3D transform metrics tuned for larger cards (SSR-safe via CSS variables)
            const translateZ = -Math.abs(effectiveOffset) * 155;
            const rotateY = -effectiveOffset * 22;
            const scale = Math.max(1 - Math.abs(effectiveOffset) * 0.16, 0.68);
            const opacity = Math.max(1 - Math.abs(effectiveOffset) * 0.32, 0);
            const zIndex = 30 - Math.round(Math.abs(effectiveOffset) * 10);

            return (
              <div
                key={speaker.id}
                onClick={() => {
                  if (!isDragging && Math.abs(offset) > 0) {
                    setActiveIndex(index);
                  }
                }}
                className={`absolute inset-0 will-change-transform rounded-[32px] sm:rounded-[36px] overflow-hidden ${
                  !isDragging ? "transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]" : ""
                } ${!isCenter ? "cursor-pointer" : ""}`}
                style={{
                  transform: `translate3d(calc(${effectiveOffset} * var(--speaker-spacing)), 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                  opacity,
                  zIndex,
                  boxShadow: isCenter
                    ? "0 32px 85px -15px rgba(0, 0, 0, 0.32), 0 16px 40px -10px rgba(0, 0, 0, 0.18)"
                    : "0 20px 50px -12px rgba(0, 0, 0, 0.22)",
                }}
              >
                {/* Full-Bleed Speaker Portrait */}
                <img
                  src={speaker.image}
                  alt={speaker.name}
                  className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none select-none"
                  loading="eager"
                  draggable={false}
                />

                {/* ------------------------------------------------- */}
                {/* SOFT ATMOSPHERIC GRADIENT & FROSTED BLUR BASE    */}
                {/* Recreating reference image lower portion look     */}
                {/* ------------------------------------------------- */}
                <div className="absolute inset-x-0 bottom-0 h-[52%] pointer-events-none rounded-b-[32px] sm:rounded-b-[36px] overflow-hidden flex flex-col justify-end">
                  {/* Frosted glass backdrop blur */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(15, 23, 42, 0.94) 0%, rgba(15, 23, 42, 0.76) 42%, rgba(15, 23, 42, 0.22) 78%, transparent 100%)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      maskImage: "linear-gradient(to top, black 70%, transparent 100%)",
                      WebkitMaskImage: "linear-gradient(to top, black 70%, transparent 100%)",
                    }}
                  />
                  {/* Subtle atmospheric ambient glow matching portrait */}
                  <div
                    className="absolute inset-0 opacity-45 mix-blend-color-dodge"
                    style={{
                      background: `radial-gradient(ellipse at bottom, ${
                        speaker.ambientColor || "rgba(66, 133, 244, 0.45)"
                      } 0%, transparent 80%)`,
                    }}
                  />
                </div>

                {/* ------------------------------------------------- */}
                {/* CARD CONTENT: NAME, DESIGNATION, TALK TOPIC       */}
                {/* Strictly 3 elements, clean & elegant              */}
                {/* ------------------------------------------------- */}
                <div className="relative z-10 w-full h-full p-6 sm:p-8 md:p-9 flex flex-col justify-end text-left select-none pointer-events-none">
                  {/* 1. Speaker Name */}
                  <h3
                    className="text-[26px] sm:text-[28px] md:text-[30px] font-semibold text-white tracking-tight leading-tight"
                    style={{
                      textShadow: "0 2px 12px rgba(0, 0, 0, 0.55)",
                    }}
                  >
                    {speaker.name}
                  </h3>

                  {/* 2. Designation */}
                  <p
                    className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-white/90 leading-snug mt-1"
                    style={{
                      textShadow: "0 1px 6px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    {speaker.designation}
                  </p>

                  {/* 3. Talk Topic */}
                  <p
                    className="text-[13px] sm:text-[14px] md:text-[15px] font-normal text-white/80 leading-relaxed mt-2.5 line-clamp-3"
                    style={{
                      textShadow: "0 1px 6px rgba(0, 0, 0, 0.4)",
                    }}
                  >
                    {speaker.topic}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* 3. NAVIGATION CONTROLS (ONLY PREV & NEXT ARROWS)          */}
      {/* --------------------------------------------------------- */}
      <div className="flex items-center justify-center gap-4 mt-4 sm:mt-6">
        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSpeaker}
          aria-label="Previous speaker"
          className="group flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#D2D6DC] text-[#202124] hover:bg-[#F8F9FA] hover:border-[#9AA0A6] hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 text-[#3C4043] transition-transform duration-200 group-hover:-translate-x-1" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={nextSpeaker}
          aria-label="Next speaker"
          className="group flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#D2D6DC] text-[#202124] hover:bg-[#F8F9FA] hover:border-[#9AA0A6] hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
        >
          <ArrowRight className="w-5 h-5 text-[#3C4043] transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );
}
