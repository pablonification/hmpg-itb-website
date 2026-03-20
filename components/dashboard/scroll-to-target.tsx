"use client";

import { useEffect } from "react";

export function ScrollToTarget({
  targetId,
  enabled = true,
}: {
  targetId: string;
  enabled?: boolean;
}) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const element = document.getElementById(targetId);
      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [enabled, targetId]);

  return null;
}
