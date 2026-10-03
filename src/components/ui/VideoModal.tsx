import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { lockScroll } from "../../lib/animations";

export function VideoModal({ url, onClose }: { url: string; onClose: () => void }) {
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    lockScroll(true);
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Gym video"
      onClick={onClose}
      className="fixed inset-0 z-[80] grid place-items-center bg-black/90 p-4"
    >
      <button
        ref={closeBtn}
        type="button"
        onClick={onClose}
        aria-label="Close video"
        className="absolute top-4 right-4 grid size-11 place-items-center rounded-full border border-white/20 hover:bg-brand hover:text-ink"
      >
        <X className="size-5" />
      </button>
      <div className="aspect-video w-full max-w-5xl overflow-hidden rounded-lg" onClick={(e) => e.stopPropagation()}>
        <iframe
          src={`${url}${url.includes("?") ? "&" : "?"}autoplay=1`}
          title="Baroda Fitness Factory video"
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="h-full w-full"
        />
      </div>
    </div>
  );
}
