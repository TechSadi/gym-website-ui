import { useRef } from "react";
import { images, pillars } from "../data/site";
import { gsap, MOTION_OK, useGSAP, useReveal } from "../lib/animations";
import { Button } from "./ui/Button";
import { SectionHeading } from "./ui/SectionHeading";

export function About() {
  const root = useRef<HTMLElement>(null);

  useReveal(root);

  // A yellow panel sweeps across the frame, then pulls away to uncover the photo.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-about-frame]", start: "top 75%", once: true } })
          .fromTo("[data-wipe]", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: 0.55, ease: "power3.in" })
          .set("[data-about-img]", { autoAlpha: 1 })
          .set("[data-wipe]", { transformOrigin: "right center" })
          .to("[data-wipe]", { scaleX: 0, duration: 0.7, ease: "power3.out" })
          .from("[data-about-img]", { scale: 1.25, duration: 1.4, ease: "power3.out" }, "<")
          .from("[data-corner]", { autoAlpha: 0, x: -16, y: 16, duration: 0.6 }, "<0.2");
        gsap.set("[data-about-img]", { autoAlpha: 0 });
      });
    },
    { scope: root },
  );

  return (
    <section id="about" ref={root} className="py-20 lg:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="relative pb-4 pl-4">
          <div data-corner aria-hidden className="absolute bottom-0 left-0 size-28 border-b-4 border-l-4 border-brand" />
          <div data-about-frame className="relative aspect-[4/3] overflow-hidden rounded-lg bg-coal">
            <img
              data-about-img
              src={images.about.src}
              srcSet={images.about.srcSet}
              sizes="(min-width: 1024px) 45vw, 100vw"
              alt={images.about.alt}
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div data-wipe aria-hidden className="absolute inset-0 bg-brand" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>

        <div>
          <SectionHeading eyebrow="About us" top="Baroda" bottom="Fitness factory" />
          <div data-fade className="mt-6 max-w-[60ch] space-y-4 leading-relaxed text-white/75">
            <p>
              We are a locally owned and operated gym, dedicated to helping you reach your fitness and health goals.
            </p>
            <p>
              With modern equipment, expert trainers and a supportive community, we make fitness accessible, effective and
              enjoyable for everyone.
            </p>
          </div>

          <ul data-stagger className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
            {pillars.map(({ icon: Icon, label }) => (
              <li key={label} className="group flex flex-col items-center gap-3 bg-ink px-3 py-6 text-center">
                <Icon aria-hidden strokeWidth={1.75} className="size-8 text-brand transition-transform duration-300 group-hover:-translate-y-1" />
                <span className="text-sm leading-snug font-semibold">{label}</span>
              </li>
            ))}
          </ul>

          <div data-fade className="mt-10">
            <Button href="#membership">See membership plans</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
