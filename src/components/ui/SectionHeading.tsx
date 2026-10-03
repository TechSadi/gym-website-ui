type Props = {
  eyebrow: string;
  top: string;
  bottom: string;
  /** Render both parts on one line, as in "Choose your plan". */
  inline?: boolean;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({ eyebrow, top, bottom, inline, align = "left", className = "" }: Props) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <p data-eyebrow className="eyebrow">
        {eyebrow}
      </p>
      <h2 data-heading className="heading-xl mt-4 text-[clamp(2.4rem,5.2vw,4rem)]">
        {inline ? (
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-line className="block">
              {top} <span className="text-brand">{bottom}</span>
            </span>
          </span>
        ) : (
          <>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block">
                {top}
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block text-brand">
                {bottom}
              </span>
            </span>
          </>
        )}
      </h2>
    </div>
  );
}
