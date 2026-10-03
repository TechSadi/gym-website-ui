import { type MouseEvent, type ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { scrollToId } from "../../lib/animations";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "outline";
  size?: "md" | "sm";
  full?: boolean;
  arrow?: boolean;
  disabled?: boolean;
  className?: string;
};

const variants = {
  primary: "bg-brand text-ink hover:bg-white",
  outline: "border border-white/25 text-white hover:border-brand hover:text-brand",
};

const sizes = {
  md: "px-6 py-3.5 text-sm",
  sm: "px-4 py-2.5 text-[0.8125rem]",
};

export function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  full,
  arrow = true,
  disabled,
  className = "",
}: Props) {
  const classes = `group inline-flex items-center justify-center gap-2.5 rounded-[4px] font-bold tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${full ? "w-full" : ""} ${className}`;

  const content = (
    <>
      {children}
      {arrow && <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />}
    </>
  );

  if (href) {
    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
      onClick?.();
      if (href.startsWith("#")) {
        e.preventDefault();
        scrollToId(href.slice(1));
      }
    };
    return (
      <a href={href} onClick={handleClick} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {content}
    </button>
  );
}
