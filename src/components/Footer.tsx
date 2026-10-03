import { socials } from "../data/site";
import { Logo } from "./ui/Logo";
import { SocialIcon } from "./ui/SocialIcon";

export function Footer() {
  return (
    <footer className="border-t border-line bg-coal py-12">
      <div className="container-x flex flex-col items-center gap-10 text-center md:flex-row md:justify-between md:text-left">
        <Logo size="lg" tagline />

        <ul className="flex gap-3">
          {socials.map(({ name, href }) => (
            <li key={name}>
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Baroda Fitness Factory on ${name}`}
                className="grid size-11 place-items-center rounded-full bg-brand text-ink transition-transform duration-300 hover:-translate-y-1 hover:bg-white"
              >
                <SocialIcon name={name} />
              </a>
            </li>
          ))}
        </ul>

        <div className="text-xs text-white/60 md:text-right">
          <p>© {new Date().getFullYear()} Baroda Fitness Factory. All rights reserved.</p>
          <p className="mt-2 flex justify-center gap-4 md:justify-end">
            <a href="#" className="underline underline-offset-4 hover:text-brand">
              Privacy policy
            </a>
            <a href="#" className="underline underline-offset-4 hover:text-brand">
              Terms & conditions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
