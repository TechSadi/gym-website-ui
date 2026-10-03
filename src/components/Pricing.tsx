import { useRef } from "react";
import { CircleCheck } from "lucide-react";
import { gallery, plans, type Plan } from "../data/site";
import { gsap, hasFinePointer, MOTION_OK, useGSAP, useReveal } from "../lib/animations";
import { Button } from "./ui/Button";
import { SectionHeading } from "./ui/SectionHeading";

/** Lets the contact form know which plan was picked. */
export const PLAN_EVENT = "bff:plan";

function PlanCard({ plan }: { plan: Plan }) {
  const card = useRef<HTMLDivElement>(null);

  // Mouse-tracked 3D tilt.
  useGSAP(
    () => {
      const el = card.current;
      if (!el || !hasFinePointer()) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const rx = gsap.quickTo(el, "rotationX", { duration: 0.5, ease: "power3.out" });
        const ry = gsap.quickTo(el, "rotationY", { duration: 0.5, ease: "power3.out" });
        gsap.set(el, { transformPerspective: 900 });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 10);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 10);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: card },
  );

  const choose = () => window.dispatchEvent(new CustomEvent(PLAN_EVENT, { detail: plan.name }));

  return (
    <div className={plan.popular ? "order-first lg:order-none lg:-mt-4" : ""}>
      <div
        ref={card}
        className={`relative flex h-full flex-col rounded-lg border bg-ink/85 p-7 backdrop-blur-sm sm:p-8 ${
          plan.popular
            ? "rounded-t-none border-2 border-brand shadow-[0_0_70px_-25px_rgba(255,212,0,0.55)]"
            : "border-line"
        }`}
      >
        {plan.popular && <div aria-hidden className="shimmer pointer-events-none absolute inset-0 rounded-b-lg" />}
        {plan.popular && (
          <p className="absolute inset-x-[-2px] bottom-full rounded-t-lg bg-brand py-1.5 text-center text-xs font-bold tracking-[0.14em] text-ink uppercase">
            Most popular
          </p>
        )}
        <h3 className="text-2xl font-bold">{plan.name} plan</h3>
        <p className="mt-2 min-h-[3em] text-sm leading-relaxed text-muted">{plan.blurb}</p>

        <p className="mt-6 flex items-baseline gap-1.5">
          <span className="heading-xl text-5xl">
            ₹<span data-price={plan.price}>{plan.price}</span>
          </span>
          <span className="text-xs font-semibold tracking-wider text-muted uppercase">/ month</span>
        </p>

        <div className="mt-6">
          <Button href="#contact" onClick={choose} full arrow={false}>
            Get started
          </Button>
        </div>

        <ul className="mt-7 space-y-3.5 text-sm">
          {plan.perks.map((perk) => (
            <li key={perk} className="flex items-start gap-3">
              <CircleCheck aria-hidden strokeWidth={2.25} className="size-5 shrink-0 fill-brand text-ink" />
              <span className="pt-px text-white/85">{perk}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Pricing() {
  const root = useRef<HTMLElement>(null);

  useReveal(root);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray<HTMLElement>("[data-price]").forEach((el) => {
          const counter = { value: 0 };
          gsap.to(counter, {
            value: Number(el.dataset.price),
            duration: 1.6,
            ease: "power3.out",
            onUpdate: () => {
              el.textContent = String(Math.round(counter.value));
            },
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="membership" ref={root} className="relative isolate overflow-hidden bg-coal py-20 lg:py-28">
      <img
        src={gallery[1].src}
        alt=""
        aria-hidden
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover opacity-[0.09] grayscale"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-linear-to-b from-coal via-transparent to-coal" />

      <div className="container-x">
        <SectionHeading eyebrow="Membership" top="Choose" bottom="your plan" inline align="center" />
        <p data-fade className="mt-4 text-center text-white/75">
          Flexible plans to fit your goals and lifestyle.
        </p>

        <div data-stagger className="mx-auto mt-16 grid max-w-md gap-12 lg:max-w-none lg:grid-cols-3 lg:gap-6 xl:gap-8">
          {plans.map((plan) => (
            <PlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}
