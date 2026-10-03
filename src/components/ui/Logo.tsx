import { logo } from "../../data/site";

export function Logo({ size = "md", tagline }: { size?: "md" | "lg"; tagline?: boolean }) {
  const img = size === "lg" ? "size-16" : "size-10 sm:size-12";
  const text = size === "lg" ? "text-2xl" : "text-lg sm:text-xl";
  return (
    <span className="flex items-center gap-3">
      <img src={logo} alt="" width={48} height={48} className={`${img} shrink-0 rounded-full object-cover ring-1 ring-brand/40`} />
      <span className="flex flex-col">
        <span className={`heading-xl ${text} leading-[0.95]`}>
          Baroda
          <span className="block text-brand">Fitness Factory</span>
        </span>
        {tagline && (
          <span className="mt-2 text-[0.6875rem] font-semibold tracking-[0.2em] text-white/70 uppercase">
            Stronger • Fitter • Together
          </span>
        )}
      </span>
    </span>
  );
}
