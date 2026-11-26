"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Matter from "matter-js";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  lanyardColor: string;
  lanyardSecondary: string;
  badgeId: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "lead-1",
    name: "Aravind Swaminathan",
    role: "Community Lead & Organizer",
    image: "/images/speakers/speaker-2.jpg",
    lanyardColor: "#4285F4", // Google Blue
    lanyardSecondary: "#2A75E8",
    badgeId: "GDG-MDU-01",
  },
  {
    id: "lead-2",
    name: "Deepika Sundaram",
    role: "Technical Program Director",
    image: "/images/speakers/speaker-3.jpg",
    lanyardColor: "#EA4335", // Google Red
    lanyardSecondary: "#D32F2F",
    badgeId: "GDG-MDU-02",
  },
  {
    id: "lead-3",
    name: "Karthik Raja",
    role: "AI & Cloud Architecture Lead",
    image: "/images/speakers/speaker-1.jpg",
    lanyardColor: "#FBBC04", // Google Yellow
    lanyardSecondary: "#F29900",
    badgeId: "GDG-MDU-03",
  },
  {
    id: "lead-4",
    name: "Meera Krishnan",
    role: "Design & UX Evangelist",
    image: "/images/speakers/speaker-4.jpg",
    lanyardColor: "#34A853", // Google Green
    lanyardSecondary: "#1E8E3E",
    badgeId: "GDG-MDU-04",
  },
];

interface CardPhysicsState {
  x: number;
  y: number;
  angle: number;
  isDragging: boolean;
}

export function TeamIdCardsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollWrapperRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const cardBodiesRef = useRef<Matter.Body[]>([]);
  const [anchors, setAnchors] = useState<{ x: number; y: number }[]>(() =>
    TEAM_MEMBERS.map((_, i) => ({ x: 180 + i * 280, y: -35 }))
  );
  const [lanyardLengths, setLanyardLengths] = useState<number[]>([185, 195, 180, 200]);
  const animFrameIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Dragging interaction state
  const dragInfoRef = useRef<{
    cardIndex: number;
    grabOffset: { x: number; y: number }; // local offset relative to card center
    pointerId: number;
    currentX: number;
    currentY: number;
  } | null>(null);

  // React state to drive rendering of DOM cards & SVG lanyards
  // Pre-seeded with desktop coordinates so cards are NEVER stuck at (0, 0)
  const [cardStates, setCardStates] = useState<CardPhysicsState[]>(() =>
    TEAM_MEMBERS.map((_, i) => ({
      x: 180 + i * 280,
      y: 330,
      angle: 0,
      isDragging: false,
    }))
  );
  const [dimensions, setDimensions] = useState<{
    stageWidth: number;
    stageHeight: number;
    cardW: number;
    cardH: number;
    isMobile: boolean;
  }>({
    stageWidth: 1200,
    stageHeight: 535,
    cardW: 235,
    cardH: 340,
    isMobile: false,
  });

  // Calculate layout specifications based on container width
  const getLayout = useCallback((containerWidth: number) => {
    const isMobile = containerWidth < 768;
    if (isMobile) {
      // Mobile: generous scrollable stage (860px) so all 4 cards have ample breathing space and never collide
      const stageWidth = 860;
      const stageHeight = 440;
      const cardW = 175;
      const cardH = 265;
      const lanyardL = 165;
      return { stageWidth, stageHeight, cardW, cardH, lanyardL, isMobile: true };
    }
    // Desktop / Tablet
    const stageWidth = containerWidth;
    const stageHeight = containerWidth < 1024 ? 490 : 535;
    const cardW = containerWidth < 1024 ? 195 : 235;
    const cardH = containerWidth < 1024 ? 295 : 340;
    const lanyardL = containerWidth < 1024 ? 165 : 190;
    return { stageWidth, stageHeight, cardW, cardH, lanyardL, isMobile: false };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Mobile uses a smooth native horizontal touch-scrollable gallery without Matter.js overhead
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    startTimeRef.current = performance.now();

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Matter.js Module aliases
    const { Engine, Bodies, Composite, Body } = Matter;

    const engine = Engine.create({
      gravity: { x: 0, y: 1.15, scale: 0.001 },
      constraintIterations: 4,
      positionIterations: 6,
      velocityIterations: 4,
    });
    engineRef.current = engine;

    const rect = container.getBoundingClientRect();
    const containerW = rect.width > 400 ? rect.width : 1200;
    const layout = getLayout(containerW);

    setDimensions({
      stageWidth: layout.stageWidth,
      stageHeight: layout.stageHeight,
      cardW: layout.cardW,
      cardH: layout.cardH,
      isMobile: false,
    });

    const cardCount = TEAM_MEMBERS.length;
    // Compute anchor positions horizontally
    const paddingX = layout.isMobile ? 95 : layout.stageWidth * 0.12;
    const usableWidth = layout.stageWidth - paddingX * 2;
    const spacing = usableWidth / (cardCount - 1);

    const anchors: { x: number; y: number }[] = [];
    const lanyardLengths: number[] = [];
    const cardBodies: Matter.Body[] = [];

    // Subtle variations in rest height and idle sway per card
    const lengthVariations = [-8, 6, -5, 10];
    const idlePhases = [0, 1.4, 3.1, 4.8];
    const idleSpeeds = [0.0016, 0.002, 0.0017, 0.0022];

    for (let i = 0; i < cardCount; i++) {
      const anchorX = paddingX + i * spacing;
      // Top anchor positioned above the top edge (-35px) so lanyards emerge from blurred white space
      const anchorY = -35;
      const length = layout.lanyardL + lengthVariations[i];

      anchors.push({ x: anchorX, y: anchorY });
      lanyardLengths.push(length);

      const initialCardY = anchorY + length + layout.cardH / 2;

      // Create ID card rigid body with collisionFilter group -1 (never collide explosively)
      const cardBody = Bodies.rectangle(anchorX, initialCardY, layout.cardW, layout.cardH, {
        chamfer: { radius: 24 },
        density: 0.002,
        frictionAir: prefersReducedMotion ? 0.08 : 0.024,
        restitution: 0.2,
        friction: 0.15,
        collisionFilter: {
          group: -1, // Negative group ensures cards NEVER jostle or explode outward on spawn
        },
      });

      // Ensure calm vertical rest state initially
      Body.setPosition(cardBody, { x: anchorX, y: initialCardY });
      Body.setVelocity(cardBody, { x: 0, y: 0 });
      Body.setAngle(cardBody, 0);
      Body.setAngularVelocity(cardBody, 0);

      cardBodies.push(cardBody);
      Composite.add(engine.world, cardBody);
    }

    cardBodiesRef.current = cardBodies;
    setAnchors(anchors);
    setLanyardLengths(lanyardLengths);

    // Invisible boundary floor to prevent cards from dropping infinitely
    const ground = Bodies.rectangle(layout.stageWidth / 2, layout.stageHeight + 200, layout.stageWidth * 2, 100, {
      isStatic: true,
    });
    Composite.add(engine.world, ground);

    // Immediately synchronize React state with card body positions for instantaneous frame 0 render
    setCardStates(
      cardBodies.map((body) => ({
        x: body.position.x,
        y: body.position.y,
        angle: body.angle,
        isDragging: false,
      }))
    );

    // Physics update step
    const updatePhysics = (currentTime: number) => {
      animFrameIdRef.current = requestAnimationFrame(updatePhysics);

      const activeDrag = dragInfoRef.current;
      const timeSinceMount = currentTime - startTimeRef.current;
      // Graceful ramp-up for ambient sway so cards remain perfectly calm on initial entrance
      const swayRamp = Math.min(1, Math.max(0, (timeSinceMount - 800) / 2000));

      // 1. Process custom realistic lanyard physics (unilateral rope constraint)
      for (let i = 0; i < cardBodies.length; i++) {
        const body = cardBodies[i];
        const anchor = anchors[i];
        const maxLen = lanyardLengths[i];

        // Attachment point at the top center of the card
        const cos = Math.cos(body.angle);
        const sin = Math.sin(body.angle);
        const topOffsetY = -layout.cardH / 2;
        const clipX = body.position.x - sin * topOffsetY;
        const clipY = body.position.y + cos * topOffsetY;

        const dx = clipX - anchor.x;
        const dy = clipY - anchor.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Ambient idle breeze sway (gentle natural drift when not dragging)
        if (!prefersReducedMotion && swayRamp > 0 && (!activeDrag || activeDrag.cardIndex !== i)) {
          const swayTime = currentTime * idleSpeeds[i] + idlePhases[i];
          const swayForceX = Math.sin(swayTime) * (0.0003 * swayRamp);
          Body.applyForce(body, body.position, { x: swayForceX, y: 0 });
        }

        // Rope constraint: pulls back towards anchor only when distance > maxLen
        if (dist > maxLen) {
          const tensionMagnitude = (dist - maxLen) * 0.085;
          const nx = dx / dist;
          const ny = dy / dist;

          // Apply restorative force directly at the top clip point (creates natural card tilt!)
          const force = {
            x: -nx * tensionMagnitude,
            y: -ny * tensionMagnitude,
          };
          Body.applyForce(body, { x: clipX, y: clipY }, force);

          // Damping along the rope vector to prevent erratic oscillations
          const relVelX = body.velocity.x;
          const relVelY = body.velocity.y;
          const velAlongRope = relVelX * nx + relVelY * ny;
          if (velAlongRope > 0) {
            Body.applyForce(body, { x: clipX, y: clipY }, {
              x: -nx * velAlongRope * 0.05,
              y: -ny * velAlongRope * 0.05,
            });
          }
        }
      }

      // Soft separation between neighboring cards to prevent awkward overlap without violent explosions
      for (let i = 0; i < cardBodies.length; i++) {
        for (let j = i + 1; j < cardBodies.length; j++) {
          const b1 = cardBodies[i];
          const b2 = cardBodies[j];
          const sepX = b2.position.x - b1.position.x;
          const sepY = b2.position.y - b1.position.y;
          const minDistX = layout.cardW * 0.9;
          const minDistY = layout.cardH * 0.7;

          if (Math.abs(sepX) < minDistX && Math.abs(sepY) < minDistY) {
            const overlapX = minDistX - Math.abs(sepX);
            const dirX = sepX > 0 ? 1 : -1;
            const pushForce = overlapX * 0.00018;
            Body.applyForce(b1, b1.position, { x: -dirX * pushForce, y: 0 });
            Body.applyForce(b2, b2.position, { x: dirX * pushForce, y: 0 });
          }
        }
      }

      // 2. Dragging physics: spring force applied directly to the grab contact point
      if (activeDrag && activeDrag.cardIndex >= 0) {
        const body = cardBodies[activeDrag.cardIndex];
        if (body) {
          const cos = Math.cos(body.angle);
          const sin = Math.sin(body.angle);
          const grabWorldX = body.position.x + cos * activeDrag.grabOffset.x - sin * activeDrag.grabOffset.y;
          const grabWorldY = body.position.y + sin * activeDrag.grabOffset.x + cos * activeDrag.grabOffset.y;

          const toTargetX = activeDrag.currentX - grabWorldX;
          const toTargetY = activeDrag.currentY - grabWorldY;

          const pullK = 0.0048;
          const dampK = 0.016;

          Body.applyForce(body, { x: grabWorldX, y: grabWorldY }, {
            x: toTargetX * pullK - body.velocity.x * dampK,
            y: toTargetY * pullK - body.velocity.y * dampK,
          });
        }
      }

      // Fixed standard 60Hz physics timestep for deterministic stability (<= 16.667ms)
      Engine.update(engine, 16.66);

      // Push positions to React state for 60FPS DOM & SVG rendering
      setCardStates(
        cardBodies.map((body, idx) => ({
          x: body.position.x,
          y: body.position.y,
          angle: body.angle,
          isDragging: activeDrag?.cardIndex === idx,
        }))
      );
    };

    animFrameIdRef.current = requestAnimationFrame(updatePhysics);

    // Handle window resize
    const handleResize = () => {
      if (!container) return;
      const newRect = container.getBoundingClientRect();
      const newContainerW = newRect.width;
      const newLayout = getLayout(newContainerW);

      setDimensions({
        stageWidth: newLayout.stageWidth,
        stageHeight: newLayout.stageHeight,
        cardW: newLayout.cardW,
        cardH: newLayout.cardH,
        isMobile: newLayout.isMobile,
      });

      const newPaddingX = newLayout.isMobile ? 95 : newLayout.stageWidth * 0.12;
      const newUsableWidth = newLayout.stageWidth - newPaddingX * 2;
      const newSpacing = newUsableWidth / (cardCount - 1);

      for (let i = 0; i < cardCount; i++) {
        const newX = newPaddingX + i * newSpacing;
        anchors[i] = { x: newX, y: -35 };
        lanyardLengths[i] = newLayout.lanyardL + lengthVariations[i];

        if (cardBodies[i]) {
          Body.setPosition(cardBodies[i], {
            x: newX,
            y: -35 + newLayout.lanyardL + newLayout.cardH / 2,
          });
          Body.setVelocity(cardBodies[i], { x: 0, y: 0 });
          Body.setAngle(cardBodies[i], 0);
          Body.setAngularVelocity(cardBodies[i], 0);
        }
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [getLayout]);

  // Pointer interaction handlers
  const handlePointerDown = (cardIndex: number, e: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;

    const body = cardBodiesRef.current[cardIndex];
    if (!body) return;

    const rect = container.getBoundingClientRect();
    const pointerX = e.clientX - rect.left;
    const pointerY = e.clientY - rect.top;

    // Convert pointer to local body coordinates relative to card center
    const dx = pointerX - body.position.x;
    const dy = pointerY - body.position.y;
    const cos = Math.cos(-body.angle);
    const sin = Math.sin(-body.angle);
    const localX = cos * dx - sin * dy;
    const localY = sin * dx + cos * dy;

    dragInfoRef.current = {
      cardIndex,
      grabOffset: { x: localX, y: localY },
      pointerId: e.pointerId,
      currentX: pointerX,
      currentY: pointerY,
    };

    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const activeDrag = dragInfoRef.current;
    if (!activeDrag || activeDrag.pointerId !== e.pointerId) return;

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    activeDrag.currentX = e.clientX - rect.left;
    activeDrag.currentY = e.clientY - rect.top;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const activeDrag = dragInfoRef.current;
    if (!activeDrag || activeDrag.pointerId !== e.pointerId) return;

    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore if pointer capture already lost
    }
    dragInfoRef.current = null;
  };

  return (
    <section
      id="team"
      className="relative w-full bg-white font-sans pt-8 sm:pt-12 pb-4 sm:pb-6 overflow-hidden select-none border-t border-[#F1F3F4] scroll-mt-20 sm:scroll-mt-24"
      aria-label="GDG Madurai Hanging Team ID Cards"
    >
      {/* --------------------------------------------------------- */}
      {/* 1. SECTION HEADER                                         */}
      {/* --------------------------------------------------------- */}
      <div className="w-[94%] sm:w-[90%] md:w-[85%] max-w-[1280px] mx-auto mb-6 sm:mb-8 md:mb-12">
        <div className="text-left max-w-[640px]">
          <span className="text-[11px] sm:text-[12px] font-bold tracking-[0.08em] text-[#34A853] uppercase block mb-2 sm:mb-3">
            Core Organizing Team 2026
          </span>
          <h2
            className="text-[#202124] font-semibold tracking-tight text-left"
            style={{
              fontSize: "clamp(34px, 5vw, 54px)",
              lineHeight: 1.12,
              letterSpacing: "-0.035em",
            }}
          >
            Behind the Community
          </h2>
          <p className="mt-2 text-[15px] sm:text-[17px] font-normal text-[#5F6368] leading-relaxed">
            The passionate developers, designers, and community architects powering GDG Madurai.
          </p>
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* 2A. MOBILE CLEAN HORIZONTAL CAROUSEL (< 768px)            */}
      {/* No Matter.js physics traps, full vertical scrolling to footer */}
      {/* --------------------------------------------------------- */}
      <div className="block md:hidden w-full pb-8">
        <div
          className="w-full overflow-x-auto flex gap-4 px-6 pt-10 pb-6 snap-x snap-mandatory scroll-smooth no-scrollbar touch-pan-x touch-pan-y"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {TEAM_MEMBERS.map((member) => (
            <div
              key={`mobile-${member.id}`}
              className="flex-shrink-0 snap-center flex flex-col items-center"
              style={{ width: "240px" }}
            >
              {/* Lanyard Top Strap */}
              <div className="relative w-7 h-10 flex flex-col items-center">
                {/* Colored Ribbon */}
                <div
                  className="w-full h-full rounded-t-sm shadow-sm relative overflow-hidden"
                  style={{
                    backgroundColor: member.lanyardColor,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  }}
                >
                  {/* Subtle stitch lines */}
                  <div className="absolute inset-y-0 left-[2px] w-[1px] bg-black/15" />
                  <div className="absolute inset-y-0 right-[2px] w-[1px] bg-black/15" />
                </div>
                {/* Metallic Clip */}
                <div className="w-5 h-3 bg-gradient-to-b from-[#E4E4E7] via-[#A1A1AA] to-[#71717A] rounded-b-sm shadow-sm -mt-[1px] z-10 flex items-center justify-center">
                  <div className="w-2.5 h-1 bg-[#27272A] rounded-full" />
                </div>
              </div>

              {/* ID Badge Card */}
              <div className="relative w-[240px] h-[340px] rounded-[24px] overflow-hidden bg-white shadow-[0_16px_36px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)] border border-black/[0.08] -mt-1 select-none">
                {/* Badge slot */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                  <div className="w-8 h-2 rounded-full bg-white/90 border border-black/15 flex items-center justify-center backdrop-blur-md">
                    <div className="w-4 h-0.5 rounded-full bg-black/40" />
                  </div>
                </div>

                {/* Top GDG Badge Tag */}
                <div className="absolute top-6 left-3.5 right-3.5 z-20 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/60 shadow-sm">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: member.lanyardColor }}
                    />
                    <span className="text-[10px] font-bold tracking-wider text-[#202124] uppercase">
                      GDG 2026
                    </span>
                  </div>
                  <span className="text-[9px] font-semibold tracking-widest text-white/90 drop-shadow-sm uppercase">
                    {member.badgeId}
                  </span>
                </div>

                {/* Portrait Image */}
                <div className="relative w-full h-full overflow-hidden bg-[#F1F3F4]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="240px"
                    className="object-cover object-top select-none pointer-events-none"
                    priority
                  />

                  {/* Gradient Specular */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/25 pointer-events-none" />

                  {/* Bottom details overlay */}
                  <div
                    className="absolute inset-x-0 bottom-0 pt-16 pb-4 px-4 flex flex-col justify-end pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(17, 17, 19, 0.94) 0%, rgba(17, 17, 19, 0.75) 50%, rgba(17, 17, 19, 0.2) 75%, transparent 100%)",
                      backdropFilter: "blur(3px)",
                      WebkitBackdropFilter: "blur(3px)",
                    }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: member.lanyardColor }}
                    />
                    <h3 className="text-white font-semibold text-[17px] tracking-tight leading-tight drop-shadow-sm">
                      {member.name}
                    </h3>
                    <p className="mt-0.5 text-white/80 text-[12px] font-medium leading-snug">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swipe Guidance & Indicators */}
        <div className="flex items-center justify-center gap-2 mt-2">
          {TEAM_MEMBERS.map((m) => (
            <div
              key={`dot-${m.id}`}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: m.lanyardColor }}
            />
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------- */}
      {/* 2B. DESKTOP INTERACTIVE PHYSICS STAGE (>= 768px)          */}
      {/* --------------------------------------------------------- */}
      <div className="hidden md:block relative w-full">
        <div
          ref={scrollWrapperRef}
          className="relative w-full overflow-x-auto no-scrollbar touch-pan-x"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div
            ref={containerRef}
            style={{
              width: "100%",
              maxWidth: "1360px",
              height: `${dimensions.stageHeight}px`,
            }}
            className="relative mx-auto overflow-visible cursor-grab active:cursor-grabbing touch-none"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
          {/* Progressive Feathered Mist at Top Ceiling */}
          <div
            className="absolute top-0 left-0 right-0 h-44 sm:h-52 pointer-events-none z-30"
            style={{
              background:
                "linear-gradient(to bottom, #ffffff 0%, rgba(255, 255, 255, 0.95) 25%, rgba(255, 255, 255, 0.55) 60%, rgba(255, 255, 255, 0) 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.85) 35%, rgba(0, 0, 0, 0.2) 75%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0.85) 35%, rgba(0, 0, 0, 0.2) 75%, transparent 100%)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          />

          {/* SVG Lanyards, Clips, and Straps Layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
            style={{ width: "100%", height: "100%" }}
          >
            <defs>
              {/* Drop shadow filter for 3D realism on broad lanyards */}
              <filter id="lanyard-shadow" x="-30%" y="-10%" width="160%" height="130%">
                <feDropShadow dx="2" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.16" />
              </filter>

              {/* Ambient Radial Aura Filter at top ceiling */}
              <filter id="aura-glow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="30" result="blur" />
              </filter>

              {/* Metallic clip gradient */}
              <linearGradient id="metal-clip-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#D4D4D8" />
                <stop offset="65%" stopColor="#A1A1AA" />
                <stop offset="100%" stopColor="#E4E4E7" />
              </linearGradient>
            </defs>

            {TEAM_MEMBERS.map((member, i) => {
              const anchor = anchors[i] || { x: (i + 1) * 220, y: -35 };
              const cardState = cardStates[i] || { x: anchor.x, y: 320, angle: 0 };
              const { cardH, isMobile } = dimensions;

              // Top clip attachment point on the card (rotates with card)
              const cos = Math.cos(cardState.angle);
              const sin = Math.sin(cardState.angle);
              const clipOffsetY = -cardH / 2;
              const clipX = cardState.x - sin * clipOffsetY;
              const clipY = cardState.y + cos * clipOffsetY;

              // Natural lanyard curve physics:
              const dx = clipX - anchor.x;
              const dy = clipY - anchor.y;
              const dist = Math.sqrt(dx * dx + dy * dy);
              const maxL = lanyardLengths[i] || 180;
              const slack = Math.max(0, maxL - dist);

              // Sag curve droop when card is lifted up
              const sagX = dx * 0.4 + Math.sin(cardState.angle) * (slack * 0.35);
              const sagY = dy * 0.5 + slack * 0.7;

              const cp1X = anchor.x + sagX * 0.3;
              const cp1Y = anchor.y + Math.max(50, dy * 0.28) + sagY * 0.5;

              const cp2X = clipX - sin * 50 - sagX * 0.2;
              const cp2Y = clipY - cos * 50 + sagY * 0.3;

              const ribbonPath = `M ${anchor.x} ${anchor.y} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${clipX} ${clipY}`;

              // Fully visible, bold, broad lanyard strap dimensions
              const mainStrapWidth = isMobile ? 24 : 30;
              const outerBorderWidth = isMobile ? 28 : 35;
              const stitchWidth = isMobile ? 2 : 2.5;

              return (
                <g key={`lanyard-${member.id}`}>
                  {/* Layer 1: Ambient Gaussian Bokeh Aura at Top Anchor */}
                  <circle
                    cx={anchor.x}
                    cy={anchor.y + 60}
                    r={isMobile ? 50 : 70}
                    fill={member.lanyardColor}
                    filter="url(#aura-glow)"
                    opacity={0.25}
                  />

                  {/* Layer 2: Lanyard Fabric Ribbon - Outer Border / Seam with realistic drop shadow */}
                  <path
                    d={ribbonPath}
                    fill="none"
                    stroke={member.lanyardSecondary}
                    strokeWidth={outerBorderWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    opacity={0.45}
                    filter="url(#lanyard-shadow)"
                  />

                  {/* Layer 3: Lanyard Fabric Ribbon - Full Width Solid Main Body in Google Color */}
                  <path
                    d={ribbonPath}
                    fill="none"
                    stroke={member.lanyardColor}
                    strokeWidth={mainStrapWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Layer 4: Lanyard Woven Fabric Texture (Crisp White Inset Stitch) */}
                  <path
                    d={ribbonPath}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.75)"
                    strokeWidth={stitchWidth}
                    strokeDasharray="5 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Broad Metallic Lobster Claw Clip & Swivel Attachment */}
                  <g transform={`translate(${clipX}, ${clipY}) rotate(${(cardState.angle * 180) / Math.PI})`}>
                    {/* Metal Swivel Ring (Scaled up to match broad lanyard) */}
                    <ellipse
                      cx={0}
                      cy={-18}
                      rx={isMobile ? 8 : 10}
                      ry={isMobile ? 4.5 : 5.5}
                      fill="url(#metal-clip-grad)"
                      stroke="#71717A"
                      strokeWidth={1.2}
                    />
                    {/* Lobster Claw Body */}
                    <path
                      d="M -7 -16 L -6 -3 L -3 0 L 3 0 L 6 -3 L 7 -16 Z"
                      fill="url(#metal-clip-grad)"
                      stroke="#52525B"
                      strokeWidth={1.2}
                    />
                    {/* Metal clasp pin passing through card slot */}
                    <rect
                      x={-4}
                      y={0}
                      width={8}
                      height={12}
                      rx={2.5}
                      fill="url(#metal-clip-grad)"
                      stroke="#3F3F46"
                      strokeWidth={1}
                    />
                    {/* Metallic Specular Highlight */}
                    <circle cx={-1.5} cy={-8} r={2.5} fill="white" opacity={0.75} />
                  </g>
                </g>
              );
            })}
          </svg>

          {/* Interactive ID Cards (DOM rendered for Retina portraits and typography) */}
          {TEAM_MEMBERS.map((member, i) => {
            const cardState = cardStates[i] || { x: 0, y: 0, angle: 0, isDragging: false };
            const { cardW, cardH } = dimensions;

            return (
              <div
                key={member.id}
                onPointerDown={(e) => handlePointerDown(i, e)}
                style={{
                  width: `${cardW}px`,
                  height: `${cardH}px`,
                  transform: `translate3d(${cardState.x - cardW / 2}px, ${cardState.y - cardH / 2}px, 0) rotate(${cardState.angle}rad)`,
                  transformOrigin: "center center",
                  willChange: "transform",
                  zIndex: cardState.isDragging ? 40 : 20,
                  boxShadow: cardState.isDragging
                    ? "0 32px 64px -12px rgba(0, 0, 0, 0.28), 0 14px 28px -4px rgba(0, 0, 0, 0.16)"
                    : "0 18px 40px -8px rgba(0, 0, 0, 0.14), 0 6px 16px -2px rgba(0, 0, 0, 0.08)",
                }}
                className="absolute top-0 left-0 rounded-[24px] sm:rounded-[28px] overflow-hidden bg-white cursor-grab active:cursor-grabbing transition-shadow duration-200 border border-black/[0.06] select-none"
              >
                {/* 1. Lanyard Badge Slot / Hole Cutout at Top */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center">
                  <div className="w-9 h-2.5 rounded-full bg-white/90 border border-black/15 shadow-inner flex items-center justify-center backdrop-blur-md">
                    <div className="w-5 h-1 rounded-full bg-black/40" />
                  </div>
                </div>

                {/* 2. Top GDG Badge Tag */}
                <div className="absolute top-6 left-3.5 sm:left-4 right-3.5 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 backdrop-blur-md border border-white/60 shadow-sm">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: member.lanyardColor }}
                    />
                    <span className="text-[10px] sm:text-[11px] font-bold tracking-wider text-[#202124] uppercase">
                      GDG 2026
                    </span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-semibold tracking-widest text-white/90 drop-shadow-sm uppercase">
                    {member.badgeId}
                  </span>
                </div>

                {/* 3. High-Quality Portrait Image */}
                <div className="relative w-full h-full overflow-hidden bg-[#F1F3F4]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 175px, (max-width: 1024px) 200px, 240px"
                    className="object-cover object-top select-none pointer-events-none transition-transform duration-300"
                    priority
                  />

                  {/* Glass Specular Glare across card face for 3D depth */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/30 pointer-events-none" />

                  {/* 4. Bottom Soft Frosted Color & Dark Gradient Overlay */}
                  <div
                    className="absolute inset-x-0 bottom-0 pt-16 pb-3.5 sm:pb-5 px-3.5 sm:px-5 flex flex-col justify-end pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(17, 17, 19, 0.94) 0%, rgba(17, 17, 19, 0.75) 50%, rgba(17, 17, 19, 0.25) 75%, transparent 100%)",
                      backdropFilter: "blur(3px)",
                      WebkitBackdropFilter: "blur(3px)",
                    }}
                  >
                    {/* Subtle accent color glow near name */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-1"
                      style={{ backgroundColor: member.lanyardColor }}
                    />

                    {/* Member Name */}
                    <h3 className="text-white font-semibold text-[15px] sm:text-[18px] md:text-[21px] tracking-tight leading-tight drop-shadow-sm">
                      {member.name}
                    </h3>

                    {/* Member Designation */}
                    <p className="mt-0.5 sm:mt-1 text-white/80 text-[11px] sm:text-[13px] md:text-[14px] font-medium leading-snug">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Subtle outer acrylic rim */}
                <div className="absolute inset-0 rounded-[24px] sm:rounded-[28px] border border-white/20 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </section>
  );
}
