import { useRef, useState } from "react";
import { Play } from "lucide-react";
import { gallery, images, tagline, videoUrl } from "../data/site";
import { gsap, introReady, MOTION_OK, SplitText, useGSAP } from "../lib/animations";
import { Button } from "./ui/Button";
import { Lightbox } from "./ui/Lightbox";
import { MagneticButton } from "./ui/MagneticButton";
import { VideoModal } from "./ui/VideoModal";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [tourOpen, setTourOpen] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        let alive = true;
        const split = SplitText.create("[data-hero-title] [data-line]", { type: "words,chars", mask: "words" });

        const intro = gsap
          .timeline({ paused: true, defaults: { ease: "power4.out" } })
          .from("[data-hero-img]", { scale: 1.2, duration: 2.6, ease: "power2.out" }, 0)
          .from("[data-hero-eyebrow] > span", { y: 14, autoAlpha: 0, stagger: 0.1, duration: 0.6 }, 0.2)
          .from(split.chars, { yPercent: 115, duration: 1.1, stagger: 0.03 }, 0.3)
          .from("[data-hero-copy]", { y: 24, autoAlpha: 0, duration: 0.9 }, 0.9)
          .from("[data-hero-cta] > *", { scale: 0.8, autoAlpha: 0, stagger: 0.12, duration: 0.8, ease: "back.out(1.8)" }, 1.1)
          .from("[data-hero-cue]", { autoAlpha: 0, y: -10, duration: 0.6 }, 1.5);
        introReady.then(() => {
          if (alive) intro.play();
        });

        // The photo drifts slower than the page; the copy lifts away a little faster.
        const scroll = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-hero-media]", { yPercent: 14, ease: "none", scrollTrigger: scroll });
        gsap.to("[data-hero-content]", { yPercent: -18, autoAlpha: 0.2, ease: "none", scrollTrigger: scroll });

        return () => {
          alive = false;
          split.revert();
        };
      });
    },
    { scope: root },
  );

  return (
    <section id="home" ref={root} className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-24">
      <div data-hero-media className="absolute inset-0 -z-20 lg:left-[24%]">
        <img
          data-hero-img
          src={images.hero.src}
          srcSet={images.hero.srcSet}
          sizes="(min-width: 1024px) 76vw, 100vw"
          alt=""
          fetchPriority="high"
          className="h-full w-full object-cover object-[58%_center]"
        />
      </div>
      {/* Mobile: darken all over. Desktop: solid ink on the left fading into the photo. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 lg:hidden"
        style={{ background: "linear-gradient(180deg, rgb(10 10 10 / .55) 0%, rgb(10 10 10 / .7) 55%, #0a0a0a 100%)" }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden lg:block"
        style={{
          background:
            "linear-gradient(90deg, #0a0a0a 24%, rgb(10 10 10 / .8) 38%, rgb(10 10 10 / .1) 62%), linear-gradient(0deg, #0a0a0a 0%, transparent 22%)",
        }}
      />

      <div className="container-x">
        <div data-hero-content className="max-w-3xl">
          <p data-hero-eyebrow className="eyebrow flex flex-wrap items-center gap-x-3">
            {tagline.map((word, i) => (
              <span key={word} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden className="size-1 rounded-full bg-brand" />}
                {word}
              </span>
            ))}
          </p>

          <h1 data-hero-title className="heading-xl mt-5 text-[clamp(3.4rem,8.6vw,7rem)] leading-[0.92]">
            <span data-line className="block">
              Build your
            </span>
            <span data-line className="block text-brand">
              Stronger self
            </span>
          </h1>

          <p data-hero-copy className="mt-7 max-w-md text-lg leading-relaxed text-white/80">
            Baroda Fitness Factory is more than a gym. It's a community that helps you become the best version of yourself.
          </p>

          <div data-hero-cta className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
            <MagneticButton>
              <Button href="#membership">Join now</Button>
            </MagneticButton>
            <button type="button" onClick={() => setTourOpen(true)} className="group flex items-center gap-4 text-sm font-bold">
              <span className="ping-ring relative grid size-13 place-items-center rounded-full border-2 border-white/80 transition-colors duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-ink">
                <Play className="ml-0.5 size-4 fill-current" />
              </span>
              {videoUrl ? "Watch video" : "Take the tour"}
            </button>
          </div>
        </div>
      </div>

      <div data-hero-cue aria-hidden className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 sm:flex">
        <span className="text-[0.6875rem] font-semibold tracking-[0.3em] text-white/60 uppercase">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/15">
          <span className="scroll-cue-line absolute inset-x-0 top-0 h-1/2 bg-brand" />
        </span>
      </div>

      {tourOpen &&
        (videoUrl ? (
          <VideoModal url={videoUrl} onClose={() => setTourOpen(false)} />
        ) : (
          <Lightbox images={gallery} title="Tour of the gym" autoplay onClose={() => setTourOpen(false)} />
        ))}
    </section>
  );
}
