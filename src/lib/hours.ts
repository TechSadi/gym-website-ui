import { openingHours } from "../data/site";

export type OpenStatus = { open: boolean; label: string };

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatHour = (h: number) => `${h % 12 || 12}:00 ${h < 12 ? "AM" : "PM"}`;

/** Whether the gym is open right now, using India Standard Time wherever the visitor is. */
export function getOpenStatus(now = new Date()): OpenStatus {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";

  const day = DAYS.indexOf(get("weekday"));
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const [openAt, closeAt] = openingHours[day];

  if (minutes >= openAt * 60 && minutes < closeAt * 60) {
    return { open: true, label: `Open now · closes at ${formatHour(closeAt)}` };
  }
  if (minutes < openAt * 60) {
    return { open: false, label: `Closed now · opens at ${formatHour(openAt)}` };
  }
  const [tomorrowOpen] = openingHours[(day + 1) % 7];
  return { open: false, label: `Closed now · opens tomorrow at ${formatHour(tomorrowOpen)}` };
}
