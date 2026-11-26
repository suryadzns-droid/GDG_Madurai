import React from "react";

export function GDGLogo({
  className = "h-11 sm:h-13 md:h-14 w-auto object-contain",
  alt = "Google Developer Groups",
  variant = "light",
}: {
  className?: string;
  alt?: string;
  variant?: "light" | "dark";
}) {
  return (
    <img
      src={variant === "dark" ? "/images/GDG_Logo_Dark.png" : "/images/GDG_Logo.png"}
      alt={alt}
      className={className}
      loading="eager"
    />
  );
}

export function GoogleDots() {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-full bg-[#4285F4]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#EA4335]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#FBBC04]" />
      <span className="w-2.5 h-2.5 rounded-full bg-[#34A853]" />
    </span>
  );
}
