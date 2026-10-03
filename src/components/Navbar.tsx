import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "../data/site";
import { gsap, lockScroll, MOTION_OK, scrollToId, useGSAP } from "../lib/animations";
import { Button } from "./ui/Button";
import { Logo } from "./ui/Logo";

type SectionId = (typeof nav)[number]["id"];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<SectionId>("home");
  const [open, setOpen] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const links = useRef(new Map<SectionId, HTMLAnchorElement>());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section that crosses the middle of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id as SectionId);
      },
      { rootMargin: "-45% 0px -54% 0px" },
    );
    nav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const place = () => {
      const el = links.current.get(active);
      if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth });
    };
    place();
    window.addEventListener("resize", place);
    document.fonts?.ready.then(place);
    return () => window.removeEventListener("resize", place);
  }, [active]);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useGSAP(
    () => {
      gsap.fromTo(
        "[data-progress]",
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } },
      );
    },
    { scope: header },
  );

  useGSAP(
    () => {
      if (!open) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(menu.current, { clipPath: "inset(0 0 100% 0)", duration: 0.5, ease: "power4.inOut" });
        gsap.from("[data-menu-link]", { yPercent: 110, duration: 0.7, stagger: 0.06, ease: "power4.out", delay: 0.2 });
        gsap.from("[data-menu-foot]", { autoAlpha: 0, y: 16, duration: 0.5, delay: 0.5 });
      });
    },
    { scope: menu, dependencies: [open] },
  );

  const go = (id: string) => (e: MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <header
        ref={header}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          scrolled || open ? "border-line bg-ink/85 backdrop-blur-md" : "border-transparent bg-transparent"
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:rounded focus:bg-brand focus:px-4 focus:py-2 focus:text-ink"
        >
          Skip to content
        </a>
        <nav aria-label="Main" className={`container-x flex items-center justify-between transition-[height] duration-300 ${scrolled ? "h-16 sm:h-18" : "h-18 sm:h-22"}`}>
          <a href="#home" onClick={go("home")} aria-label="Baroda Fitness Factory, back to top">
            <Logo />
          </a>

          <ul className="relative hidden items-center gap-8 lg:flex">
            {nav.map(({ id, label }) => (
              <li key={id}>
                <a
                  ref={(el) => {
                    if (el) links.current.set(id, el);
                  }}
                  href={`#${id}`}
                  onClick={go(id)}
                  aria-current={active === id ? "true" : undefined}
                  className={`py-2 text-sm font-semibold transition-colors ${active === id ? "text-brand" : "text-white/85 hover:text-white"}`}
                >
                  {label}
                </a>
              </li>
            ))}
            <span
              aria-hidden
              className="absolute -bottom-1.5 h-0.5 bg-brand transition-[left,width] duration-500 ease-[cubic-bezier(.65,0,.35,1)]"
              style={indicator}
            />
          </ul>

          <div className="hidden lg:block">
            <Button href="#membership" size="sm">
              Join now
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-11 place-items-center rounded-full border border-white/20 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
        <div data-progress aria-hidden className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-brand" />
      </header>

      {open && (
        <div
          ref={menu}
          id="mobile-menu"
          className="fixed inset-0 z-40 flex flex-col justify-between bg-ink px-6 pt-28 pb-10 lg:hidden"
        >
          <ul className="space-y-1">
            {nav.map(({ id, label }) => (
              <li key={id} className="overflow-hidden">
                <a
                  data-menu-link
                  href={`#${id}`}
                  onClick={go(id)}
                  className={`heading-xl block py-1 text-[clamp(2.75rem,12vw,4rem)] ${active === id ? "text-brand" : "text-white"}`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div data-menu-foot>
            <Button href="#membership" full onClick={() => setOpen(false)}>
              Join now
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
