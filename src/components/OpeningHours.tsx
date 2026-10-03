import { useEffect, useRef, useState } from "react";
import { CalendarX2 } from "lucide-react";
import { hours, images } from "../data/site";
import { gsap, MOTION_OK, useGSAP, useReveal } from "../lib/animations";
import { getOpenStatus } from "../lib/hours";
import { SectionHeading } from "./ui/SectionHeading";

function ClockIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className="size-14 shrink-0 text-brand">
      <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="3" />
      {[0, 90, 180, 270].map((deg) => (
        <line key={deg} x1="24" y1="6.5" x2="24" y2="9.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${deg} 24 24)`} />
      ))}
      <line data-hand="hour" x1="24" y1="24" x2="24" y2="15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <line data-hand="minute" x1="24" y1="24" x2="33" y2="24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2.2" fill="currentColor" />
    </svg>
  );
}

export function OpeningHours() {
  const root = useRef<HTMLElement>(null);
  const [status, setStatus] = useState(getOpenStatus);

  useEffect(() => {
    const id = window.setInterval(() => setStatus(getOpenStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to("[data-hand=minute]", { rotation: 360, svgOrigin: "24 24", duration: 6, ease: "none", repeat: -1 });
        gsap.to("[data-hand=hour]", { rotation: 360, svgOrigin: "24 24", duration: 72, ease: "none", repeat: -1 });

        gsap.fromTo(
          "[data-sched-img]",
          { yPercent: -8 },
          { yPercent: 8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } },
        );

        gsap
          .timeline({ scrollTrigger: { trigger: "[data-brush]", start: "top 85%", once: true } })
          .fromTo("[data-brush-line]", { clipPath: "inset(-20% 100% -20% 0)" }, { clipPath: "inset(-20% 0% -20% 0)", duration: 0.7, stagger: 0.35, ease: "power2.inOut" })
          .fromTo("[data-swash]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.6, ease: "power2.out" }, "-=0.15");
      });
    },
    { scope: root },
  );

  return (
    <section id="schedule" ref={root} className="relative isolate overflow-hidden border-y border-line bg-ink">
      <div className="relative h-80 overflow-hidden sm:h-[26rem] lg:absolute lg:inset-y-0 lg:right-0 lg:left-[40%] lg:h-auto">
        <img
          data-sched-img
          src={images.schedule.src}
          srcSet={images.schedule.srcSet}
          sizes="(min-width: 1024px) 60vw, 100vw"
          alt={images.schedule.alt}
          loading="lazy"
          className="absolute -inset-y-[10%] inset-x-0 h-[120%] w-full object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-linear-to-b from-transparent via-ink/20 to-ink lg:hidden" />
        <div
          aria-hidden
          className="absolute inset-0 hidden lg:block"
          style={{ background: "linear-gradient(90deg, #0a0a0a 0%, rgb(10 10 10 / .55) 30%, rgb(10 10 10 / .1) 65%)" }}
        />

        <div
          data-brush
          aria-label="No excuses, just results"
          role="img"
          className="absolute right-5 bottom-10 -rotate-[8deg] text-right font-brush leading-[0.95] sm:right-10 lg:top-1/2 lg:right-[9%] lg:bottom-auto lg:-translate-y-1/2"
        >
          <span data-brush-line className="block text-[clamp(2rem,4.5vw,3.5rem)] text-white">
            No excuses
          </span>
          <span data-brush-line className="block text-[clamp(2.2rem,5vw,3.9rem)] text-brand">
            Just results
          </span>
          <svg viewBox="0 0 240 24" aria-hidden className="mt-1 ml-auto w-[80%] text-brand" preserveAspectRatio="none">
            <path
              data-swash
              d="M4 18 C 60 6, 150 4, 236 10"
              pathLength={1}
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray="1"
            />
          </svg>
        </div>
      </div>

      <div className="container-x relative pt-4 pb-16 lg:py-28">
        <div className="max-w-md">
          <div className="flex items-start gap-5">
            <ClockIcon />
            <SectionHeading eyebrow="Opening hours" top="We're open" bottom="7 days a week" />
          </div>

          <p data-fade role="status" className="mt-8 inline-flex items-center gap-2.5 rounded-full border border-line bg-coal px-4 py-2 text-sm font-semibold">
            <span className="relative flex size-2.5">
              {status.open && <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-75 motion-reduce:hidden" />}
              <span className={`relative size-2.5 rounded-full ${status.open ? "bg-brand" : "bg-white/40"}`} />
            </span>
            {status.label}
          </p>

          <dl data-stagger className="mt-8 divide-y divide-line border-y border-line">
            {hours.map(({ days, time }) => (
              <div key={days} className="py-5">
                <dt className="text-white/70">{days}</dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums">{time}</dd>
              </div>
            ))}
          </dl>

          <p data-fade className="mt-8 inline-flex items-center gap-2.5 rounded border border-brand/70 px-4 py-2.5 text-sm font-semibold text-brand">
            <CalendarX2 aria-hidden className="size-4" />
            Closed on Sunday afternoons
          </p>
        </div>
      </div>
    </section>
  );
}
