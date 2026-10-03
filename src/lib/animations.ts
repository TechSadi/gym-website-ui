import { type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const NAV_OFFSET = -72;
let lenis: Lenis | null = null;

/** Smooth scrolling driven by the GSAP ticker so ScrollTrigger stays in sync. Skipped for reduced motion. */
export function startSmoothScroll() {
  if (prefersReducedMotion()) return;
  lenis = new Lenis({ duration: 1.1 });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  // Links inside an open overlay (the mobile menu) fire while scrolling is still locked.
  lockScroll(false);
  if (lenis) {
    lenis.scrollTo(el, { offset: id === "home" ? 0 : NAV_OFFSET, force: true });
    return;
  }
  const top = id === "home" ? 0 : el.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/** Freezes page scroll while an overlay (menu, lightbox, preloader) is open. */
export function lockScroll(locked: boolean) {
  if (locked) lenis?.stop();
  else lenis?.start();
  document.documentElement.style.overflow = locked ? "hidden" : "";
}

// The hero intro waits for the preloader to lift before it plays.
let resolveIntro: () => void = () => {};
export const introReady = new Promise<void>((resolve) => {
  resolveIntro = resolve;
});
export const markIntroReady = () => resolveIntro();

/**
 * Scroll reveals for a section. Tag elements with:
 * - data-eyebrow: slides in from the left
 * - data-heading: its [data-line] children rise out of a clip mask
 * - data-stagger: its direct children rise in one after another
 * - data-fade: rises and fades in
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const on = (el: Element, start = "top 86%") => ({ trigger: el, start, once: true });

        root.querySelectorAll("[data-eyebrow]").forEach((el) =>
          gsap.from(el, { x: -24, autoAlpha: 0, duration: 0.7, ease: "power3.out", scrollTrigger: on(el, "top 90%") }),
        );
        root.querySelectorAll("[data-heading]").forEach((el) =>
          gsap.from(el.querySelectorAll("[data-line]"), {
            yPercent: 110,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: on(el, "top 88%"),
          }),
        );
        root.querySelectorAll("[data-stagger]").forEach((group) =>
          gsap.from(group.children, {
            y: 40,
            autoAlpha: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: on(group),
          }),
        );
        root.querySelectorAll("[data-fade]").forEach((el) =>
          gsap.from(el, { y: 24, autoAlpha: 0, duration: 0.8, ease: "power3.out", scrollTrigger: on(el, "top 90%") }),
        );
      });
    },
    { scope },
  );
}
