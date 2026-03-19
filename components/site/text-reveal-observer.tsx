"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

const AUTO_REVEAL_SELECTOR = [
  "[data-auto-reveal] h1",
  "[data-auto-reveal] h2",
  "[data-auto-reveal] h3",
  "[data-auto-reveal] h4",
  "[data-auto-reveal] p",
  "[data-auto-reveal] blockquote",
  "[data-auto-reveal] li",
  "[data-auto-reveal] figcaption",
  "[data-auto-reveal] [data-reveal-link]",
].join(", ");

const INITIAL_REVEAL_DELAY_MS = 140;

function isEligible(element: HTMLElement) {
  if (element.closest("[data-reveal-ignore]")) {
    return false;
  }

  const styles = window.getComputedStyle(element);

  return styles.display !== "none" && styles.visibility !== "hidden";
}

function resolveGroup(element: HTMLElement) {
  return (
    element.closest("[data-reveal-group]") ??
    element.closest("section, article, form, footer, aside, main") ??
    document.body
  );
}

function isInViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return rect.top < viewportHeight * 0.9 && rect.bottom > 0;
}

export function TextRevealObserver() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const revealTimeouts: number[] = [];

    const manualElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const autoElements = Array.from(
      document.querySelectorAll<HTMLElement>(AUTO_REVEAL_SELECTOR),
    ).filter((element) => !element.hasAttribute("data-reveal"));
    const elements = [...new Set([...manualElements, ...autoElements])].filter(
      isEligible,
    );

    const groupedElements = new Map<Element, HTMLElement[]>();

    elements.forEach((element) => {
      const group = resolveGroup(element);
      const currentGroup = groupedElements.get(group) ?? [];

      currentGroup.push(element);
      groupedElements.set(group, currentGroup);
    });

    groupedElements.forEach((group) => {
      group.forEach((element, index) => {
        if (!element.dataset.reveal) {
          element.dataset.reveal = "rise";
          element.dataset.revealGenerated = "true";
        }

        element.dataset.revealReady = "true";

        if (!element.style.getPropertyValue("--reveal-delay")) {
          const customDelay = Number.parseInt(
            element.dataset.revealDelay ?? "",
            10,
          );
          const computedDelay = Number.isFinite(customDelay)
            ? customDelay
            : Math.min(index * 90, 420);

          element.style.setProperty("--reveal-delay", `${computedDelay}ms`);
          element.dataset.revealManagedDelay = "true";
        }

        if (prefersReducedMotion) {
          element.dataset.revealVisible = "true";
          return;
        }

        element.dataset.revealVisible = "false";
        delete element.dataset.revealAnimate;
      });
    });

    root.setAttribute("data-reveal-mounted", "true");

    if (prefersReducedMotion) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const element = entry.target as HTMLElement;

          element.dataset.revealAnimate = "true";
          element.dataset.revealVisible = "true";
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px",
      },
    );

    elements.forEach((element) => {
      if (element.dataset.revealVisible === "true") {
        return;
      }

      if (isInViewport(element)) {
        const timeout = window.setTimeout(() => {
          element.dataset.revealAnimate = "true";
          element.dataset.revealVisible = "true";
        }, INITIAL_REVEAL_DELAY_MS);

        revealTimeouts.push(timeout);
        return;
      }

      observer.observe(element);
    });

    return () => {
      revealTimeouts.forEach((timeout) => window.clearTimeout(timeout));
      observer.disconnect();
      elements.forEach((element) => {
        delete element.dataset.revealReady;
        delete element.dataset.revealVisible;
        delete element.dataset.revealAnimate;

        if (element.dataset.revealGenerated === "true") {
          delete element.dataset.reveal;
          delete element.dataset.revealGenerated;
        }

        if (element.dataset.revealManagedDelay === "true") {
          element.style.removeProperty("--reveal-delay");
          delete element.dataset.revealManagedDelay;
        }
      });
    };
  }, [pathname]);

  return null;
}
