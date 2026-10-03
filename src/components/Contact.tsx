import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { CircleCheck, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { contact } from "../data/site";
import { useReveal } from "../lib/animations";
import { isValidPhone, sendMessage } from "../lib/contact";
import { PLAN_EVENT } from "./Pricing";
import { Button } from "./ui/Button";
import { SectionHeading } from "./ui/SectionHeading";

type Field = "name" | "phone" | "message";
type Errors = Partial<Record<Field, string>>;

function validate(values: Record<Field, string>): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Enter your name.";
  if (!isValidPhone(values.phone)) errors.phone = "Enter a 10-digit mobile number, for example 98765 43210.";
  if (values.message.trim().length < 5) errors.message = "Tell us a little about what you're looking for.";
  return errors;
}

function ContactItem({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-4">
      <Icon aria-hidden strokeWidth={2} className="mt-0.5 size-6 shrink-0 text-brand" />
      <div>
        <p className="font-bold">{title}</p>
        <div className="mt-1 text-sm leading-relaxed text-white/70">{children}</div>
      </div>
    </li>
  );
}

const inputClass =
  "w-full rounded border bg-coal-2 px-4 py-3 text-sm text-white placeholder:text-white/40 transition-colors focus:border-brand focus:outline-none aria-[invalid=true]:border-red-400";

export function Contact() {
  const root = useRef<HTMLElement>(null);
  const [values, setValues] = useState<Record<Field, string>>({ name: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useReveal(root);

  // "Get started" on a plan card pre-fills the message.
  useEffect(() => {
    const onPlan = (e: Event) => {
      const plan = (e as CustomEvent<string>).detail;
      setValues((v) => ({ ...v, message: `Hi, I'd like to join with the ${plan} plan.` }));
    };
    window.addEventListener(PLAN_EVENT, onPlan);
    return () => window.removeEventListener(PLAN_EVENT, onPlan);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(id);
  }, [toast]);

  const update = (field: Field) => (e: { target: { value: string } }) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      e.currentTarget.querySelector<HTMLElement>(`[name=${firstInvalid}]`)?.focus();
      return;
    }
    setSending(true);
    try {
      await sendMessage(values);
      setToast(`Message sent. Thanks, ${values.name.trim().split(" ")[0]}! We'll call you back soon.`);
      setValues({ name: "", phone: "", message: "" });
    } catch {
      setToast(`Your message wasn't sent. Check your connection and try again, or call us on ${contact.phone}.`);
    } finally {
      setSending(false);
    }
  };

  const fieldProps = (field: Field) => ({
    id: `contact-${field}`,
    name: field,
    value: values[field],
    onChange: update(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? `contact-${field}-error` : undefined,
    className: `${inputClass} ${errors[field] ? "" : "border-line"}`,
  });

  const errorText = (field: Field) =>
    errors[field] && (
      <p id={`contact-${field}-error`} className="mt-1.5 text-xs text-red-300">
        {errors[field]}
      </p>
    );

  return (
    <section id="contact" ref={root} className="border-t border-line bg-ink py-20 lg:py-28">
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_0.9fr_1.15fr] lg:gap-12">
        <div>
          <SectionHeading eyebrow="Get in touch" top="We're here" bottom="to help you" />
          <p data-fade className="mt-6 max-w-sm leading-relaxed text-white/75">
            Have questions or ready to start your fitness journey? Reach out and we'll get back to you.
          </p>
        </div>

        <ul data-stagger className="space-y-8 lg:pt-10">
          <ContactItem icon={MapPin} title="Our location">
            <a href={contact.mapsUrl} target="_blank" rel="noreferrer" className="hover:text-brand">
              {contact.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </a>
          </ContactItem>
          <ContactItem icon={Phone} title="Phone">
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="hover:text-brand">
              {contact.phone}
            </a>
          </ContactItem>
          <ContactItem icon={Mail} title="Email">
            <a href={`mailto:${contact.email}`} className="break-all hover:text-brand">
              {contact.email}
            </a>
          </ContactItem>
        </ul>

        <form data-fade noValidate onSubmit={onSubmit} className="rounded-lg border border-line bg-coal p-6 sm:p-8">
          <h3 className="text-lg font-bold">Send us a message</h3>
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="contact-name" className="sr-only">
                Name
              </label>
              <input {...fieldProps("name")} type="text" autoComplete="name" placeholder="Name" />
              {errorText("name")}
            </div>
            <div>
              <label htmlFor="contact-phone" className="sr-only">
                Phone number
              </label>
              <input {...fieldProps("phone")} type="tel" autoComplete="tel" inputMode="tel" placeholder="Phone number" />
              {errorText("phone")}
            </div>
            <div>
              <label htmlFor="contact-message" className="sr-only">
                Message
              </label>
              <textarea {...fieldProps("message")} rows={4} placeholder="Message" className={`${fieldProps("message").className} resize-y`} />
              {errorText("message")}
            </div>
          </div>
          <div className="mt-6">
            <Button type="submit" full disabled={sending}>
              {sending ? "Sending…" : "Send message"}
            </Button>
          </div>
        </form>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`fixed right-4 bottom-4 left-4 z-[70] flex items-start gap-3 rounded-lg border border-brand/60 bg-coal-2 p-4 text-sm shadow-2xl transition-all duration-300 sm:left-auto sm:max-w-sm ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        {toast && (
          <>
            <CircleCheck aria-hidden className="size-5 shrink-0 fill-brand text-ink" />
            <p>{toast}</p>
          </>
        )}
      </div>
    </section>
  );
}
