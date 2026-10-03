import { useRef } from "react";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "../lib/animations";

const words = ["Stronger", "Fitter", "Together", "No excuses", "Just results"];

/** Yellow ticker band that speeds up while the page is being scrolled. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to("[data-track]", { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
        const settle = gsap.to(loop, { timeScale: 1, duration: 1, paused: true });
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            loop.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 250, 5));
            settle.invalidate().restart(true);
          },
        });
      });
    },
    { scope: root },
  );

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {[...words, ...words].map((word, i) => (
        <li key={i} className="heading-xl flex items-center text-[clamp(1.5rem,3vw,2.25rem)] whitespace-nowrap">
          <span className="px-6">{word}</span>
          <span aria-hidden className="size-2.5 rotate-45 bg-ink" />
        </li>
      ))}
    </ul>
  );

  return (
    <div ref={root} className="overflow-hidden py-6">
      <div className="-mx-[5%] -rotate-[1.5deg] bg-brand py-3 text-ink">
        <div data-track className="flex w-max">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  );
}
