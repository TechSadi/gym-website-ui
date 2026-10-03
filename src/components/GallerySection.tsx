import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { gallery } from "../data/site";
import { gsap, MOTION_OK, prefersReducedMotion, useGSAP, useReveal } from "../lib/animations";
import { Button } from "./ui/Button";
import { Lightbox } from "./ui/Lightbox";
import { SectionHeading } from "./ui/SectionHeading";

export function GallerySection() {
  const root = useRef<HTMLElement>(null);
  const autoplay = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true, playOnInit: !prefersReducedMotion() }),
  );
  const [viewport, api] = useEmblaCarousel({ loop: true }, [autoplay.current]);
  const [selected, setSelected] = useState(0);
  const [lightboxAt, setLightboxAt] = useState<number | null>(null);

  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          "[data-gallery-frame]",
          { clipPath: "inset(0% 0% 0% 100%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.3,
            ease: "power4.inOut",
            scrollTrigger: { trigger: "[data-gallery-frame]", start: "top 80%", once: true },
          },
        );
      });
    },
    { scope: root },
  );

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const prev = useCallback(() => api?.scrollPrev(), [api]);
  const next = useCallback(() => api?.scrollNext(), [api]);
  const closeLightbox = useCallback(() => setLightboxAt(null), []);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  const arrowBtn =
    "absolute top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/25 bg-ink/60 text-white backdrop-blur transition-colors hover:border-brand hover:bg-brand hover:text-ink";

  return (
    <section id="gallery" ref={root} className="py-20 lg:py-28">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,8fr)] lg:gap-16">
        <div>
          <SectionHeading eyebrow="Our gym" top="Inside our" bottom="Fitness factory" />
          <p data-fade className="mt-6 max-w-sm leading-relaxed text-white/75">
            Modern equipment, spacious workout areas and a motivating environment. Everything you need to reach your fitness
            goals.
          </p>
          <div data-fade className="mt-9">
            <Button onClick={() => setLightboxAt(selected)}>View gallery</Button>
          </div>
        </div>

        <div>
          <div data-gallery-frame className="relative">
            <div
              ref={viewport}
              role="region"
              aria-roledescription="carousel"
              aria-label="Photos of the gym. Use the arrow keys to browse."
              tabIndex={0}
              onKeyDown={onKeyDown}
              className="overflow-hidden rounded-lg border border-line"
            >
              <div className="flex touch-pan-y">
                {gallery.map((img, i) => (
                  <div
                    key={img.src}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${gallery.length}`}
                    className="min-w-0 flex-[0_0_100%]"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-coal">
                      <img
                        src={img.src}
                        srcSet={img.srcSet}
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        alt={img.alt}
                        loading={i === 0 ? "eager" : "lazy"}
                        className={`h-full w-full object-cover transition-transform duration-[1400ms] ease-out ${
                          i === selected ? "scale-100" : "scale-110"
                        }`}
                      />
                      <div aria-hidden className="absolute inset-0 bg-linear-to-t from-ink/70 via-transparent to-transparent" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button type="button" onClick={prev} className={`${arrowBtn} left-3 sm:left-5`} aria-label="Previous photo">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={next} className={`${arrowBtn} right-3 sm:right-5`} aria-label="Next photo">
              <ChevronRight className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setLightboxAt(selected)}
              className="absolute right-4 bottom-4 flex items-center gap-2 rounded-full bg-ink/60 px-3.5 py-2 text-xs font-semibold backdrop-blur transition-colors hover:bg-brand hover:text-ink"
            >
              <Expand aria-hidden className="size-3.5" />
              Full screen
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-2.5">
            {gallery.map((img, i) => (
              <button
                key={img.src}
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === selected ? "true" : undefined}
                className="grid h-6 place-items-center"
              >
                <span
                  className={`block h-2.5 rounded-full transition-all duration-500 ${
                    i === selected ? "w-8 bg-brand" : "w-2.5 bg-white/25 hover:bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {lightboxAt !== null && (
        <Lightbox images={gallery} startIndex={lightboxAt} title="Gallery" onClose={closeLightbox} />
      )}
    </section>
  );
}
