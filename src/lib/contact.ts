export type ContactMessage = { name: string; phone: string; message: string };

/**
 * Delivers a contact form message.
 * TODO: there is no backend yet. Wire this to Formspree, an email API or WhatsApp before launch.
 * Until then messages are only logged to the console.
 */
export async function sendMessage(data: ContactMessage): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  console.info("Contact form (not delivered, no backend yet):", data);
}

/** Accepts Indian mobile numbers with or without +91 and spaces. */
export function isValidPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return /^[6-9]\d{9}$/.test(digits) || /^91[6-9]\d{9}$/.test(digits);
}
