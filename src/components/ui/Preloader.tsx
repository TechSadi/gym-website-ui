import { useRef, useState } from "react";
import { logo } from "../../data/site";
import { gsap, lockScroll, markIntroReady, prefersReducedMotion, useGSAP } from "../../lib/animations";

const SEEN_KEY = "bff-intro-seen";

function shouldShow() {
  if (prefersReducedMotion()) return false;
  try {
    return !sessionStorage.getItem(SEEN_KEY);
  } catch {
    return true;
  }
}

/** Logo, loading bar, then a curtain wipe. Plays once per browser session. */
export function Preloader() {
  const [visible, setVisible] = useState(shouldShow);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!visible) {
        markIntroReady();
        return;
      }
      lockScroll(true);
      gsap
        .timeline({
          onComplete: () => {
            try {
              sessionStorage.setItem(SEEN_KEY, "1");
            } catch {
              // Storage unavailable: the intro plays again next visit.
            }
            lockScroll(false);
            setVisible(false);
          },
        })
        .from("[data-pre-logo]", { scale: 0.6, autoAlpha: 0, duration: 0.5, ease: "back.out(1.7)" })
        .fromTo("[data-pre-bar]", { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.inOut" }, 0.15)
        .to("[data-pre-inner]", { autoAlpha: 0, y: -20, duration: 0.25 }, ">")
        .add(markIntroReady, "<")
        .to(root.current, { yPercent: -100, duration: 0.6, ease: "power4.inOut" }, "<");
    },
    { scope: root },
  );

  if (!visible) return null;

  return (
    <div ref={root} className="fixed inset-0 z-[90] grid place-items-center bg-ink" aria-hidden>
      <div data-pre-inner className="flex flex-col items-center gap-6">
        <img data-pre-logo src={logo} alt="" className="size-24 rounded-full" />
        <div className="h-0.5 w-40 overflow-hidden bg-white/10">
          <div data-pre-bar className="h-full origin-left bg-brand" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-brand" />
    </div>
  );
}
