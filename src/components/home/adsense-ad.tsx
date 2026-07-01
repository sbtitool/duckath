"use client";

import { useEffect, useRef } from "react";

const AD_CLIENT = "ca-pub-5130254389782226";

interface AdUnitProps {
  slot: string;
  className?: string;
}

export default function AdUnit({ slot, className }: AdUnitProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch {
      // Silently ignore AdSense errors
    }
  }, []);

  return (
    <ins
      className={`adsbygoogle ${className || ""}`}
      style={{ display: "block" }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={slot}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}