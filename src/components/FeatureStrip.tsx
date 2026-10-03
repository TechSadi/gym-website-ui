import { useRef } from "react";
import { features } from "../data/site";
import { gsap, MOTION_OK, useGSAP } from "../lib/animations";

export function FeatureStrip() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top 85%", once: true } });
        tl.from("[data-feature]", { y: 30, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" }).from(
          "[data-feature-icon]",
          { scale: 0, rotate: -35, duration: 0.7, stagger: 0.08, ease: "back.out(2.2)" },
          0.15,
        );
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-label="Why train with us" className="border-y border-line bg-coal">
      {/* gap-px over a line-coloured background draws the dividers at every breakpoint */}
      <ul className="container-x grid grid-cols-2 gap-px bg-line px-0! md:grid-cols-6 lg:grid-cols-5">
        {features.map(({ icon: Icon, title, text }) => (
          <li
            key={title}
            data-feature
            className="group bg-coal px-5 py-9 text-center last:col-span-2 md:col-span-2 md:last:col-span-3 md:nth-[4]:col-span-3 lg:col-span-1 lg:last:col-span-1 lg:nth-[4]:col-span-1"
          >
            <span data-feature-icon className="inline-block">
              <Icon
                aria-hidden
                strokeWidth={1.75}
                className="size-9 text-brand transition-[transform,filter] duration-300 group-hover:-translate-y-1 group-hover:drop-shadow-[0_0_12px_rgba(255,212,0,0.55)]"
              />
            </span>
            <h3 className="mt-4 text-[0.9375rem] font-bold">{title}</h3>
            <p className="mx-auto mt-1.5 max-w-[22ch] text-sm leading-relaxed text-muted">{text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
