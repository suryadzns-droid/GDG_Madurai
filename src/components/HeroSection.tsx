"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  description: string;
}

const EVENTS: EventItem[] = [
  {
    id: "community-day",
    title: "GDG Community Day 2026",
    description:
      "Join developers across Tamil Nadu for tech keynotes, community showcases, and Google technologies.",
  },
  {
    id: "devfest-madurai",
    title: "DevFest Madurai 2026",
    description:
      "Madurai’s premier annual conference for Android, Cloud, Web, and next-gen developer tools.",
  },
  {
    id: "design-thinking",
    title: "Design Thinking with Google AI",
    description:
      "Build human-centered products using Gemini API, UX sprint methodologies, and prompt design.",
  },
  {
    id: "cloud-meetup",
    title: "Google Cloud Community Meetup",
    description:
      "Architecting resilient, production-ready serverless systems and microservices on Google Cloud.",
  },
];

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Animation & Position state refs (no re-renders, 60fps GPU smoothness)
  const posRef = useRef({ targetX: 0, currentX: 0 });
  const isHoveredRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number; targetXAtStart: number } | null>(null);

  // Responsive step calculation: mobile card = 280px + 16px gap = 296px; tablet = 320px + 20px gap = 340px; desktop = 355px + 24px gap = 379px
  const getCardStep = useCallback(() => {
    if (typeof window === "undefined") return 379;
    if (window.innerWidth < 640) return 296;
    if (window.innerWidth < 768) return 340;
    return 379;
  }, []);

  // Cloudinary video URLs
  const directMp4Url =
    "https://res.cloudinary.com/dmfvslmdo/video/upload/GDG_Hero_section_video.mp4";
  const embedPlayerUrl =
    "https://player.cloudinary.com/embed/?cloud_name=dmfvslmdo&public_id=GDG_Hero_section_video";

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, []);

  // Mathematical infinite conveyor ticker loop without jump or lag
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      // Clamp delta time to 50ms to prevent huge jumps when switching browser tabs
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      const cardStep = getCardStep();
      const setWidth = EVENTS.length * cardStep;

      // Continuously glide left when not hovering (~38px/sec)
      if (!isHoveredRef.current) {
        posRef.current.targetX -= 0.038 * dt;
      }

      // Smooth lerp easing toward target position
      posRef.current.currentX +=
        (posRef.current.targetX - posRef.current.currentX) * 0.12;

      // Seamless infinite wrap in both directions:
      while (posRef.current.currentX <= -setWidth) {
        posRef.current.currentX += setWidth;
        posRef.current.targetX += setWidth;
      }
      while (posRef.current.currentX > 0) {
        posRef.current.currentX -= setWidth;
        posRef.current.targetX -= setWidth;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${posRef.current.currentX}px, 0, 0)`;
      }

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [getCardStep]);

  // Handle Previous button click (glides 1 card back)
  const handlePrev = () => {
    posRef.current.targetX += getCardStep();
  };

  // Handle Next button click (glides 1 card forward)
  const handleNext = () => {
    posRef.current.targetX -= getCardStep();
  };

  // Touch drag handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: performance.now(),
      targetXAtStart: posRef.current.targetX,
    };
    isHoveredRef.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;

    // Only drag horizontally if horizontal movement dominates
    if (Math.abs(dx) > Math.abs(dy)) {
      posRef.current.targetX = touchStartRef.current.targetXAtStart + dx;
    }
  };

  const onTouchEnd = () => {
    touchStartRef.current = null;
    // Resume auto-glide after 1.2s of releasing touch
    setTimeout(() => {
      isHoveredRef.current = false;
    }, 1200);
  };

  // 4 identical sets rendered to give plenty of buffer in both directions
  const loopedEvents = [...EVENTS, ...EVENTS, ...EVENTS, ...EVENTS];

  return (
    <div className="w-full font-sans bg-white pb-0">
      {/* ========================================================= */}
      {/* 1. CINEMATIC VIDEO SECTION (60% VIEWPORT HEIGHT)          */}
      {/* ========================================================= */}
      <section className="relative w-full h-[50vh] sm:h-[55vh] md:h-[60vh] min-h-[320px] sm:min-h-[400px] md:min-h-[460px] max-h-[680px] overflow-hidden bg-black">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover object-center"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={directMp4Url} type="video/mp4" />
            <iframe
              src={`${embedPlayerUrl}&autoplay=true&muted=true&loop=true&controls=false`}
              className="absolute inset-0 w-full h-full border-0 pointer-events-none"
              allow="autoplay; fullscreen"
              title="GDG Madurai Hero Video"
            />
          </video>
        </div>

        {/* Subtle dark overlay to maintain visual quality and ground navigation */}
        <div className="absolute inset-0 bg-black/20 pointer-events-none z-[1]" />

        {/* Center DevFest Image in Playing Video */}
        <div className="absolute inset-0 flex items-center justify-center z-[2] pointer-events-none px-6 pb-[30px] sm:pb-[50px] md:pb-[70px]">
          <img
            src="/images/Devfest.svg"
            alt="DevFest Madurai"
            className="w-[280px] sm:w-[380px] md:w-[480px] lg:w-[560px] max-w-[85vw] h-auto object-contain select-none transition-transform duration-300"
            style={{
              filter:
                "drop-shadow(0 4px 24px rgba(0, 0, 0, 0.65)) drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4))",
            }}
          />
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. FLOATING CONTENT CARD WITH MEENAKSHI AMMAN TEMPLE      */}
      {/* ========================================================= */}
      <div id="about" className="relative z-20 w-[94%] sm:w-[90%] md:w-[80%] mx-auto px-0 -mt-[40px] sm:-mt-[60px] md:-mt-[90px] scroll-mt-20 sm:scroll-mt-24">
        <div className="relative w-full rounded-[24px] sm:rounded-[28px] border border-[#E8EAED] shadow-[0_12px_44px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.04)] overflow-hidden bg-white">
          {/* Authentic Meenakshi Amman Temple Background Photo */}
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-no-repeat pointer-events-none"
            style={{
              backgroundImage: "url('/images/meenakshi-temple.jpg')",
              backgroundPosition: "center 40%",
              filter: "contrast(1.04) saturate(0.94)",
            }}
          />

          {/* Layer 1: Sophisticated Soft White Horizontal Wash for Crisp Typography Readability */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(255, 255, 255, 0.96) 0%, rgba(255, 255, 255, 0.88) 36%, rgba(255, 255, 255, 0.68) 64%, rgba(255, 255, 255, 0.86) 100%)",
            }}
          />

          {/* Layer 2: Subtle Vertical Vignette to Gently Blend Top & Bottom Edges */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.45) 0%, transparent 40%, rgba(255, 255, 255, 0.5) 100%)",
            }}
          />

          {/* ----------------------------------------------------- */}
          {/* 3. HERO INTRODUCTION INSIDE THE CARD (TWO COLUMNS)    */}
          {/* ----------------------------------------------------- */}
          <div className="relative z-10 w-full pt-[32px] sm:pt-[48px] md:pt-[64px] px-[24px] sm:px-[44px] md:px-[64px] pb-[32px] sm:pb-[48px] md:pb-[56px]">
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-6 sm:gap-10 md:gap-[80px] items-center">
              {/* Left Column: Main Heading */}
              <div className="text-left">
                <h1
                  className="text-[32px] sm:text-[40px] md:text-[48px] font-semibold text-[#1A1A1A] max-w-[580px]"
                  style={{
                    lineHeight: 1.12,
                    letterSpacing: "-1.5px",
                    textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Community for Madurai’s Tech Minds.
                </h1>
              </div>

              {/* Right Column: Description & CTA Button */}
              <div className="text-left flex flex-col items-start">
                <p
                  className="text-[16px] md:text-[17px] font-medium text-[#3C4043]"
                  style={{
                    lineHeight: 1.6,
                    textShadow: "0 1px 2px rgba(255, 255, 255, 0.8)",
                  }}
                >
                  Where local developers meet to build, share, and scale with
                  Google tech.
                </p>

                {/* CTA Button: Become a Member */}
                <a
                  href="#join"
                  style={{ backgroundColor: "#4285F3" }}
                  className="mt-[20px] sm:mt-[24px] inline-flex items-center justify-center h-[48px] px-[28px] rounded-full text-[15px] font-medium text-white transition-all duration-200 hover:brightness-95 active:scale-[0.98] shadow-sm hover:shadow"
                >
                  Become a Member
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. UPCOMING EVENTS (FULL WIDTH OF SCREEN & FULL TICKER)   */}
      {/* ========================================================= */}
      <section id="events" className="relative w-full bg-white pt-14 sm:pt-18 md:pt-20 pb-10 sm:pb-14 overflow-hidden scroll-mt-20 sm:scroll-mt-24">
        {/* Header: Left Heading & Right Black "Explore Events" Button */}
        <div className="w-[94%] sm:w-[90%] md:w-[80%] max-w-[1200px] mx-auto mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
          {/* Left Column: Heading and Description */}
          <div className="text-left">
            <span className="text-[11px] font-bold tracking-[0.08em] text-[#4285F4] uppercase mb-1.5 block">
              Stay Connected
            </span>
            <h2
              className="text-[28px] sm:text-[34px] md:text-[38px] font-semibold text-[#202124]"
              style={{
                letterSpacing: "-0.8px",
              }}
            >
              Upcoming Events
            </h2>
            <p className="mt-1 text-[15px] sm:text-[16px] font-normal text-[#5F6368]">
              Discover hands-on workshops, conferences, and meetups in our community.
            </p>
          </div>

          {/* Right Column: "Explore Events" Button in SOLID BLACK */}
          <div className="flex-shrink-0">
            <a
              href="#events"
              className="group inline-flex items-center gap-2 h-[44px] px-6 rounded-full text-[14px] font-medium text-white bg-[#000000] hover:bg-[#202124] transition-all duration-200 active:scale-[0.98] shadow-sm hover:shadow"
            >
              <span>Explore Events</span>
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </a>
          </div>
        </div>

        {/* Seamless Infinite Conveyor Track (Spanning FULL WIDTH of the screen) */}
        <div
          className="relative w-full overflow-hidden py-3 touch-pan-y"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 32px, black calc(100% - 32px), transparent)",
          }}
          onMouseEnter={() => {
            if (typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches) {
              isHoveredRef.current = true;
            }
          }}
          onMouseLeave={() => {
            isHoveredRef.current = false;
          }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onTouchCancel={onTouchEnd}
        >
          <div
            ref={trackRef}
            className="flex flex-row flex-nowrap gap-4 sm:gap-5 md:gap-6 will-change-transform"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              width: "max-content",
            }}
          >
            {loopedEvents.map((evt, i) => (
              <div
                key={`${evt.id}-${i}`}
                className="flex-shrink-0 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg w-[280px] sm:w-[320px] md:w-[355px] min-h-[200px] sm:min-h-[210px] md:min-h-[216px] rounded-[20px] sm:rounded-[22px] bg-white border-[1.5px] border-[#D2D6DC] shadow-[0_6px_20px_-2px_rgba(0,0,0,0.05),0_2px_6px_-1px_rgba(0,0,0,0.02)] p-5 sm:p-6 md:p-[26px_28px] flex flex-col justify-between"
              >
                {/* Event Content: Title & Description in Black / Dark Grey */}
                <div>
                  {/* Event Name in Bold Black */}
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "#202124",
                      letterSpacing: "-0.5px",
                      lineHeight: 1.25,
                      margin: 0,
                    }}
                  >
                    {evt.title}
                  </h3>

                  {/* Event Description in Dark Grey */}
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#5F6368",
                      lineHeight: 1.6,
                      marginTop: "10px",
                      marginBottom: 0,
                    }}
                  >
                    {evt.description}
                  </p>
                </div>

                {/* Register Now Link Text in Blue Color (Not Button) */}
                <div style={{ marginTop: "24px" }}>
                  <a
                    href="#register"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "#1A73E8",
                      textDecoration: "none",
                    }}
                    className="transition-colors duration-200 hover:text-[#1557B0] group/link"
                  >
                    <span className="hover:underline">Register Now</span>
                    <span
                      aria-hidden="true"
                      style={{ fontSize: "16px" }}
                      className="transition-transform duration-200 group-hover/link:translate-x-1"
                    >
                      →
                    </span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Controls: Previous & Next Buttons with Animated Hover Icons */}
        <div className="flex items-center justify-center gap-4 mt-8 sm:mt-10">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous events"
            className="group flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#D2D6DC] text-[#202124] hover:bg-[#F8F9FA] hover:border-[#9AA0A6] hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-[#3C4043] transition-transform duration-200 group-hover:-translate-x-1" />
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next events"
            className="group flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#D2D6DC] text-[#202124] hover:bg-[#F8F9FA] hover:border-[#9AA0A6] hover:shadow-md transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
          >
            <ArrowRight className="w-5 h-5 text-[#3C4043] transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>
      </section>
    </div>
  );
}
