"use client";

import React, { useRef, useEffect } from "react";

// Google's 4 signature colors: Blue, Red, Amber-Yellow (high contrast on white), Green
const GOOGLE_COLORS = ["#4285F4", "#EA4335", "#F9AB00", "#34A853"];

// RGB values for smooth magical color interpolation and luminous aura glow
const GOOGLE_COLOR_VALUES = [
  { r: 66, g: 133, b: 244, hex: "#4285F4" }, // Google Blue
  { r: 234, g: 67, b: 53, hex: "#EA4335" },  // Google Red
  { r: 249, g: 171, b: 0, hex: "#F9AB00" },  // Google Amber-Yellow
  { r: 52, g: 168, b: 83, hex: "#34A853" },  // Google Green
];

/**
 * Renders a word where each character is colored sequentially in Google's 4 signature colors
 */
function GoogleColoredWord({ text }: { text: string }) {
  return (
    <span className="inline-block whitespace-nowrap">
      {text.split("").map((char, idx) => (
        <span
          key={idx}
          style={{
            color: GOOGLE_COLORS[idx % GOOGLE_COLORS.length],
            display: "inline-block",
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );
}

// Sentence text with zero camelCase / TitleCase
const DESCRIPTION_TEXT =
  "google developer groups madurai is a community of developers, designers, and technology enthusiasts who come together to learn, share ideas, explore emerging technologies, and build meaningful solutions.";

const WORDS = DESCRIPTION_TEXT.split(" ");

// Smoothstep cubic easing helper
const clamp = (val: number, min: number, max: number) =>
  Math.min(Math.max(val, min), max);

const smoothStep = (min: number, max: number, val: number) => {
  const x = clamp((val - min) / (max - min), 0, 1);
  return x * x * (3 - 2 * x);
};

export function ScrollTypographySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const geminiGlowRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const line3Ref = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const wordSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const dotSpanRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const activeStepRef = useRef(0);

  // Smooth scroll to a specific step (0, 1, 2, 3)
  const scrollToStep = (stepIndex: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const winH = window.innerHeight || document.documentElement.clientHeight || 800;
    const totalHeight = rect.height || container.offsetHeight || winH * 3;
    const totalScrollable = Math.max(totalHeight - winH, 1);
    const stepFractions = [0.0, 0.33, 0.66, 1.0];
    const targetScroll =
      window.scrollY + rect.top + stepFractions[stepIndex] * totalScrollable;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    let ticking = false;

    const updateScrollAnimation = () => {
      try {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const winH = window.innerHeight || document.documentElement.clientHeight || 800;
        const totalHeight = rect.height || container.offsetHeight || winH * 3;
        const totalScrollable = Math.max(totalHeight - winH, 1);

        // Normalized scroll progress through the section (0.0 to 1.0)
        const progress = clamp(-rect.top / totalScrollable, 0, 1);

        // Determine active step index for UI dots without React re-renders
        let currentStep = 0;
        if (progress >= 0.75) {
          currentStep = 3;
        } else if (progress >= 0.45) {
          currentStep = 2;
        } else if (progress >= 0.18) {
          currentStep = 1;
        } else {
          currentStep = 0;
        }

        if (activeStepRef.current !== currentStep) {
          activeStepRef.current = currentStep;
          for (let s = 0; s < 4; s++) {
            const dot = dotSpanRefs.current[s];
            if (dot) {
              dot.style.width = currentStep === s ? "24px" : "8px";
              dot.style.backgroundColor =
                currentStep === s ? GOOGLE_COLORS[s] : "#DADCE0";
            }
          }
        }

        // =========================================================
        // 0. GEMINI VOICE ACTIVATION AMBIENT CORNER GLOW FADE
        // =========================================================
        if (geminiGlowRef.current) {
          let glowOp = 0;
          if (progress > 0.005 && progress < 0.985) {
            if (progress < 0.08) {
              glowOp = smoothStep(0.005, 0.08, progress);
            } else if (progress > 0.90) {
              glowOp = 1 - smoothStep(0.90, 0.985, progress);
            } else {
              // Very subtle organic breath synced with scroll progress
              glowOp = 0.92 + 0.08 * Math.sin(progress * Math.PI * 4);
            }
          }
          geminiGlowRef.current.style.opacity = glowOp.toFixed(3);
        }

        // =========================================================
        // 1. LINE 1: "One community."
        // =========================================================
        // Visible IMMEDIATELY upon entering (progress = 0.00 to 0.18)
        // Smoothly crossfades out as Line 2 enters: p = 0.18 to 0.30
        if (line1Ref.current) {
          let op1 = 0;
          let y1 = -32;
          if (progress <= 0.18) {
            op1 = 1;
            y1 = 0;
          } else if (progress < 0.30) {
            const t = smoothStep(0.18, 0.30, progress);
            op1 = 1 - t;
            y1 = -32 * t;
          } else {
            op1 = 0;
            y1 = -32;
          }
          line1Ref.current.style.opacity = op1.toFixed(3);
          line1Ref.current.style.transform = `translate3d(0, ${y1.toFixed(1)}px, 0)`;
          line1Ref.current.style.pointerEvents = op1 > 0.1 ? "auto" : "none";
        }

        // =========================================================
        // 2. LINE 2: "New ideas."
        // =========================================================
        if (line2Ref.current) {
          let op2 = 0;
          let y2 = 32;
          if (progress < 0.18) {
            op2 = 0;
            y2 = 32;
          } else if (progress < 0.30) {
            const t = smoothStep(0.18, 0.30, progress);
            op2 = t;
            y2 = 32 * (1 - t);
          } else if (progress <= 0.48) {
            op2 = 1;
            y2 = 0;
          } else if (progress < 0.60) {
            const t = smoothStep(0.48, 0.60, progress);
            op2 = 1 - t;
            y2 = -32 * t;
          } else {
            op2 = 0;
            y2 = -32;
          }
          line2Ref.current.style.opacity = op2.toFixed(3);
          line2Ref.current.style.transform = `translate3d(0, ${y2.toFixed(1)}px, 0)`;
          line2Ref.current.style.pointerEvents = op2 > 0.1 ? "auto" : "none";
        }

        // =========================================================
        // 3. LINE 3: "Limitless possibilities."
        // =========================================================
        if (line3Ref.current) {
          let op3 = 0;
          let y3 = 32;
          if (progress < 0.48) {
            op3 = 0;
            y3 = 32;
          } else if (progress < 0.60) {
            const t = smoothStep(0.48, 0.60, progress);
            op3 = t;
            y3 = 32 * (1 - t);
          } else if (progress <= 0.72) {
            op3 = 1;
            y3 = 0;
          } else if (progress < 0.82) {
            const t = smoothStep(0.72, 0.82, progress);
            op3 = 1 - t;
            y3 = -32 * t;
          } else {
            op3 = 0;
            y3 = -32;
          }
          line3Ref.current.style.opacity = op3.toFixed(3);
          line3Ref.current.style.transform = `translate3d(0, ${y3.toFixed(1)}px, 0)`;
          line3Ref.current.style.pointerEvents = op3 > 0.1 ? "auto" : "none";
        }

        // =========================================================
        // 4. DESCRIPTION CONTAINER
        // =========================================================
        if (descRef.current) {
          let opDesc = 0;
          let yDesc = 32;
          if (progress < 0.72) {
            opDesc = 0;
            yDesc = 32;
          } else if (progress < 0.82) {
            const t = smoothStep(0.72, 0.82, progress);
            opDesc = t;
            yDesc = 32 * (1 - t);
          } else {
            opDesc = 1;
            yDesc = 0;
          }
          descRef.current.style.opacity = opDesc.toFixed(3);
          descRef.current.style.transform = `translate3d(0, ${yDesc.toFixed(1)}px, 0)`;
          descRef.current.style.pointerEvents = opDesc > 0.1 ? "auto" : "none";
        }

        // =========================================================
        // 5. WORD-BY-WORD PROGRESS REVEAL WITH GOOGLE 4-COLOR MAGIC
        // =========================================================
        const numWords = WORDS.length;
        const revealStart = 0.82;
        const revealEnd = 0.98;
        const rangeSpan = revealEnd - revealStart;

        for (let i = 0; i < numWords; i++) {
          const span = wordSpanRefs.current[i];
          if (!span) continue;

          const wordStart = revealStart + (i / numWords) * (rangeSpan * 0.90);
          const wordEnd = wordStart + 0.038;

          let wordT = 0;
          if (progress >= wordEnd) {
            wordT = 1;
          } else if (progress <= wordStart) {
            wordT = 0;
          } else {
            wordT = smoothStep(wordStart, wordEnd, progress);
          }

          const gc = GOOGLE_COLOR_VALUES[i % GOOGLE_COLOR_VALUES.length];

          if (wordT <= 0) {
            span.style.color = "#DADCE0";
            span.style.textShadow = "none";
            span.style.transform = "translate3d(0, 0, 0)";
          } else if (wordT >= 1) {
            span.style.color = "#202124";
            span.style.textShadow = "none";
            span.style.transform = "translate3d(0, 0, 0)";
          } else {
            const glow = Math.sin(wordT * Math.PI);

            let r: number, g: number, b: number;
            if (wordT < 0.45) {
              const p1 = wordT / 0.45;
              r = Math.round(218 + (gc.r - 218) * p1);
              g = Math.round(220 + (gc.g - 220) * p1);
              b = Math.round(224 + (gc.b - 224) * p1);
            } else {
              const p2 = (wordT - 0.45) / 0.55;
              r = Math.round(gc.r + (32 - gc.r) * p2);
              g = Math.round(gc.g + (33 - gc.g) * p2);
              b = Math.round(gc.b + (36 - gc.b) * p2);
            }

            span.style.color = `rgb(${r}, ${g}, ${b})`;
            span.style.textShadow = `0 0 ${(16 * glow).toFixed(1)}px rgba(${gc.r}, ${gc.g}, ${gc.b}, ${(0.8 * glow).toFixed(2)}), 0 0 ${(5 * glow).toFixed(1)}px rgba(${gc.r}, ${gc.g}, ${gc.b}, ${(0.95 * glow).toFixed(2)})`;
            const liftY = (-3.5 * glow).toFixed(1);
            const scale = (1 + 0.05 * glow).toFixed(3);
            span.style.transform = `translate3d(0, ${liftY}px, 0) scale(${scale})`;
          }
        }
      } finally {
        // ALWAYS reset ticking to false so the scroll listener can NEVER deadlock
        ticking = false;
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollAnimation);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.addEventListener("orientationchange", onScroll, { passive: true });
    window.addEventListener("load", onScroll, { passive: true });

    // Initial calculation on mount
    updateScrollAnimation();

    // Trigger on subsequent frames to catch font/image/layout shifts on first entry
    const frameId1 = requestAnimationFrame(updateScrollAnimation);
    const timeoutId1 = setTimeout(updateScrollAnimation, 100);
    const timeoutId2 = setTimeout(updateScrollAnimation, 400);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("orientationchange", onScroll);
      window.removeEventListener("load", onScroll);
      cancelAnimationFrame(frameId1);
      clearTimeout(timeoutId1);
      clearTimeout(timeoutId2);
    };
  }, []);

  return (
    <div id="community" className="w-full relative scroll-mt-20 sm:scroll-mt-24">
      {/* ========================================================= */}
      {/* 1. MOBILE CLEAN FLOW VIEW (< 768px): ZERO STICKY TRAPS     */}
      {/* ========================================================= */}
      <section
        id="community-mobile"
        className="block md:hidden relative z-10 w-full bg-white font-sans px-6 py-14 overflow-hidden"
        aria-label="About GDG Madurai Storytelling"
      >
        {/* Subtle Ambient Gemini Corner Glow for Mobile */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          <div
            className="absolute -top-12 -left-12 w-48 h-48 rounded-full pointer-events-none opacity-40"
            style={{
              background: "radial-gradient(circle, rgba(66, 133, 243, 0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none opacity-35"
            style={{
              background: "radial-gradient(circle, rgba(234, 67, 53, 0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full pointer-events-none opacity-35"
            style={{
              background: "radial-gradient(circle, rgba(251, 188, 4, 0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full pointer-events-none opacity-35"
            style={{
              background: "radial-gradient(circle, rgba(52, 168, 83, 0.4) 0%, transparent 70%)",
              filter: "blur(40px)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[480px] mx-auto text-center flex flex-col items-center">
          <span className="text-[11px] font-bold tracking-[0.08em] text-[#4285F4] uppercase bg-[#4285F4]/8 px-3.5 py-1.5 rounded-full border border-[#4285F4]/15 inline-block mb-4">
            Our Mission & Impact
          </span>

          <h2
            className="text-[#202124] font-bold tracking-tight text-center leading-[1.12]"
            style={{
              fontSize: "clamp(36px, 9.5vw, 46px)",
              letterSpacing: "-0.035em",
            }}
          >
            One <GoogleColoredWord text="community." />
          </h2>

          <h3
            className="text-[#5F6368] font-bold tracking-tight text-center leading-[1.12] mt-3"
            style={{
              fontSize: "clamp(30px, 8vw, 38px)",
              letterSpacing: "-0.035em",
            }}
          >
            New ideas.
          </h3>

          <h3
            className="text-[#202124] font-bold tracking-tight text-center leading-[1.12] mt-3"
            style={{
              fontSize: "clamp(28px, 7.5vw, 36px)",
              letterSpacing: "-0.035em",
            }}
          >
            Limitless possibilities.
          </h3>

          {/* 4-Color Gradient Divider */}
          <div className="h-1 w-16 rounded-full bg-gradient-to-r from-[#4285F4] via-[#EA4335] via-[#FBBC04] to-[#34A853] my-6 opacity-80" />

          {/* Description Paragraph */}
          <p className="text-[15px] sm:text-[16px] font-normal text-[#3C4043] leading-relaxed text-center">
            {DESCRIPTION_TEXT}
          </p>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. DESKTOP 300VH STICKY STORYTELLING (>= 768px)            */}
      {/* ========================================================= */}
      <section
        id="community-desktop"
        ref={containerRef}
        className="hidden md:block relative z-10 w-full bg-white font-sans"
        style={{
          height: "300vh",
        }}
        aria-label="About GDG Madurai Storytelling"
      >
        {/* Sticky Fullscreen Pinned Viewport (FIRST CHILD - ALWAYS VISIBLE) */}
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-white px-6 sm:px-10 md:px-16 pointer-events-none">
          {/* Gemini Voice Activation Ambient Corner Glow Layer */}
          <div
            ref={geminiGlowRef}
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-700 ease-out"
            style={{ opacity: 0 }}
            aria-hidden="true"
          >
            {/* Top-Left: Google Blue Ambient Glow */}
            <div
              className="gemini-corner-glow absolute -top-16 -left-16 sm:-top-24 sm:-left-24 w-[50vw] h-[50vh] max-w-[650px] max-h-[550px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 0% 0%, rgba(66, 133, 243, 0.45) 0%, rgba(66, 133, 243, 0.22) 35%, rgba(66, 133, 243, 0.06) 65%, transparent 80%)",
                filter: "blur(60px)",
                animation: "geminiGlowBreathe1 11s ease-in-out infinite",
                willChange: "transform, opacity",
              }}
            />

            {/* Top-Right: Google Red Ambient Glow */}
            <div
              className="gemini-corner-glow absolute -top-16 -right-16 sm:-top-24 sm:-right-24 w-[50vw] h-[50vh] max-w-[650px] max-h-[550px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 100% 0%, rgba(234, 67, 53, 0.42) 0%, rgba(234, 67, 53, 0.20) 35%, rgba(234, 67, 53, 0.05) 65%, transparent 80%)",
                filter: "blur(60px)",
                animation: "geminiGlowBreathe2 13s ease-in-out infinite",
                willChange: "transform, opacity",
              }}
            />

            {/* Bottom-Right: Google Yellow Ambient Glow */}
            <div
              className="gemini-corner-glow absolute -bottom-16 -right-16 sm:-bottom-24 sm:-right-24 w-[50vw] h-[50vh] max-w-[650px] max-h-[550px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 100% 100%, rgba(251, 188, 4, 0.42) 0%, rgba(251, 188, 4, 0.20) 35%, rgba(251, 188, 4, 0.05) 65%, transparent 80%)",
                filter: "blur(60px)",
                animation: "geminiGlowBreathe3 12s ease-in-out infinite",
                willChange: "transform, opacity",
              }}
            />

            {/* Bottom-Left: Google Green Ambient Glow */}
            <div
              className="gemini-corner-glow absolute -bottom-16 -left-16 sm:-bottom-24 sm:-left-24 w-[50vw] h-[50vh] max-w-[650px] max-h-[550px] rounded-full pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 0% 100%, rgba(52, 168, 83, 0.42) 0%, rgba(52, 168, 83, 0.20) 35%, rgba(52, 168, 83, 0.05) 65%, transparent 80%)",
                filter: "blur(60px)",
                animation: "geminiGlowBreathe4 14s ease-in-out infinite",
                willChange: "transform, opacity",
              }}
            />

            {/* Subtle perimeter spectral transition (Gemini Voice aesthetic) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 55%, rgba(66, 133, 243, 0.05) 85%, rgba(234, 67, 53, 0.05) 100%)",
              }}
            />
          </div>

          <div className="w-full max-w-[1200px] mx-auto relative z-20 flex items-center justify-center text-center pointer-events-auto">
            {/* CSS Grid Overlay Stack: Centers all statements and description in the EXACT same spot */}
            <div
              className="grid w-full items-center justify-center text-center"
              style={{ gridTemplateAreas: '"center"' }}
            >
              {/* --------------------------------------------------- */}
              {/* LINE 1: "One community." (Visible immediately!)     */}
              {/* "community" rendered in Google's four colors        */}
              {/* --------------------------------------------------- */}
              <div
                ref={line1Ref}
                className="text-center w-full will-change-transform flex items-center justify-center"
                style={{
                  gridArea: "center",
                  opacity: 1,
                  transform: "translate3d(0, 0px, 0)",
                }}
              >
                <h2
                  className="text-[#202124] font-semibold text-center select-none"
                  style={{
                    fontSize: "clamp(52px, 8vw, 110px)",
                    fontWeight: 600,
                    lineHeight: 1.08,
                    letterSpacing: "-0.05em",
                  }}
                >
                  One <GoogleColoredWord text="community" />.
                </h2>
              </div>

              {/* --------------------------------------------------- */}
              {/* LINE 2: "New ideas."                                */}
              {/* "ideas" rendered in Google's four colors            */}
              {/* --------------------------------------------------- */}
              <div
                ref={line2Ref}
                className="text-center w-full will-change-transform flex items-center justify-center pointer-events-none"
                style={{
                  gridArea: "center",
                  opacity: 0,
                  transform: "translate3d(0, 32px, 0)",
                }}
              >
                <h2
                  className="text-[#202124] font-semibold text-center select-none"
                  style={{
                    fontSize: "clamp(52px, 8vw, 110px)",
                    fontWeight: 600,
                    lineHeight: 1.08,
                    letterSpacing: "-0.05em",
                  }}
                >
                  New <GoogleColoredWord text="ideas" />.
                </h2>
              </div>

              {/* --------------------------------------------------- */}
              {/* LINE 3: "Limitless possibilities."                  */}
              {/* "possibilities" rendered in Google's four colors    */}
              {/* --------------------------------------------------- */}
              <div
                ref={line3Ref}
                className="text-center w-full will-change-transform flex items-center justify-center pointer-events-none"
                style={{
                  gridArea: "center",
                  opacity: 0,
                  transform: "translate3d(0, 32px, 0)",
                }}
              >
                <h2
                  className="text-[#202124] font-semibold text-center select-none"
                  style={{
                    fontSize: "clamp(52px, 8vw, 110px)",
                    fontWeight: 600,
                    lineHeight: 1.08,
                    letterSpacing: "-0.05em",
                  }}
                >
                  Limitless <GoogleColoredWord text="possibilities" />.
                </h2>
              </div>

              {/* --------------------------------------------------- */}
              {/* 4. WORD-BY-WORD DESCRIPTION REVEAL                  */}
              {/* Zero camel case / TitleCase, natural lowercase text */}
              {/* --------------------------------------------------- */}
              <div
                ref={descRef}
                className="text-center w-full will-change-transform flex items-center justify-center pointer-events-none"
                style={{
                  gridArea: "center",
                  maxWidth: "1050px",
                  opacity: 0,
                  transform: "translate3d(0, 32px, 0)",
                }}
              >
                <p
                  className="text-center select-none leading-relaxed"
                  style={{
                    fontSize: "clamp(26px, 3.8vw, 50px)",
                    fontWeight: 500,
                    lineHeight: 1.45,
                    letterSpacing: "-0.035em",
                  }}
                >
                  {WORDS.map((word, i) => (
                    <React.Fragment key={`${word}-${i}`}>
                      <span
                        ref={(el) => {
                          wordSpanRefs.current[i] = el;
                        }}
                        className="inline-block"
                        style={{
                          color: "#DADCE0",
                          willChange: "color, transform, text-shadow",
                          transition: "transform 0.06s ease-out",
                        }}
                      >
                        {word}
                      </span>
                      {i < WORDS.length - 1 && " "}
                    </React.Fragment>
                  ))}
                </p>
              </div>
            </div>

            {/* --------------------------------------------------- */}
            {/* Subtle Floating Interactive Step Indicators (Right)  */}
            {/* --------------------------------------------------- */}
            <div className="absolute -right-2 sm:right-0 md:right-4 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-30">
              {[0, 1, 2, 3].map((stepIdx) => (
                <button
                  key={stepIdx}
                  type="button"
                  onClick={() => scrollToStep(stepIdx)}
                  aria-label={`Go to step ${stepIdx + 1}`}
                  className="group relative flex items-center justify-center p-1.5 focus:outline-none cursor-pointer"
                >
                  <span
                    ref={(el) => {
                      dotSpanRefs.current[stepIdx] = el;
                    }}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: stepIdx === 0 ? "24px" : "8px",
                      height: "8px",
                      backgroundColor:
                        stepIdx === 0
                          ? GOOGLE_COLORS[0]
                          : "#DADCE0",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
