import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { Picture } from "../../data/site";
import { gsap, lockScroll, prefersReducedMotion, useGSAP } from "../../lib/animations";

type Props = {
  images: Picture[];
  startIndex?: number;
  title: string;
  /** Advance through the photos on its own, like a slideshow tour. */
  autoplay?: boolean;
  onClose: () => void;
};

export function Lightbox({ images, startIndex = 0, title, autoplay, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const plugins = useRef(autoplay ? [Autoplay({ delay: 3500, stopOnInteraction: true })] : []);
  const [viewport, api] = useEmblaCarousel({ loop: true, startIndex }, plugins.current);
  const [selected, setSelected] = useState(startIndex);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setSelected(api.selectedScrollSnap());
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const prev = useCallback(() => api?.scrollPrev(), [api]);
  const next = useCallback(() => api?.scrollNext(), [api]);

  useEffect(() => {
    lockScroll(true);
    const previousFocus = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();
    return () => {
      lockScroll(false);
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
      if (e.key === "Tab" && root.current) {
        // Keep focus inside the dialog.
        const focusables = root.current.querySelectorAll<HTMLElement>("button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, prev, next]);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from(root.current, { autoAlpha: 0, duration: 0.3 });
      gsap.from("[data-lb-stage]", { scale: 0.94, autoAlpha: 0, duration: 0.5, ease: "power3.out", delay: 0.05 });
    },
    { scope: root },
  );

  const iconBtn =
    "grid size-11 place-items-center rounded-full border border-white/20 bg-ink/70 text-white transition-colors hover:border-brand hover:bg-brand hover:text-ink";

  return (
    <div ref={root} role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[80] flex flex-col bg-ink">
      <div className="container-x flex items-center justify-between py-4">
        <p className="text-sm font-semibold text-white/80">
          {title}
          <span className="ml-3 text-brand tabular-nums">
            {selected + 1} / {images.length}
          </span>
        </p>
        <button ref={closeBtn} type="button" onClick={onClose} className={iconBtn} aria-label="Close">
          <X className="size-5" />
        </button>
      </div>

      <div data-lb-stage className="relative flex flex-1 items-center">
        <div ref={viewport} className="w-full overflow-hidden">
          <div className="flex touch-pan-y">
            {images.map((img, i) => (
              <div key={img.src} className="flex min-w-0 flex-[0_0_100%] items-center justify-center px-4 sm:px-20">
                <img
                  src={img.src}
                  srcSet={img.srcSet}
                  sizes="100vw"
                  alt={img.alt}
                  loading={i === startIndex ? "eager" : "lazy"}
                  className="max-h-[76svh] w-auto max-w-full rounded-md object-contain"
                />
              </div>
            ))}
          </div>
        </div>
        <button type="button" onClick={prev} className={`${iconBtn} absolute left-3 sm:left-6`} aria-label="Previous photo">
          <ChevronLeft className="size-5" />
        </button>
        <button type="button" onClick={next} className={`${iconBtn} absolute right-3 sm:right-6`} aria-label="Next photo">
          <ChevronRight className="size-5" />
        </button>
      </div>

      <p className="container-x py-5 text-center text-sm text-white/60">{images[selected]?.alt}</p>
    </div>
  );
}
