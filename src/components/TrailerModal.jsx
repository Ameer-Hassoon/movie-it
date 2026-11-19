import { useEffect, useRef } from "react";

/** Plays a YouTube trailer in a native <dialog> (focus trap + Esc for free). */
const TrailerModal = ({ videoKey, title, open, onClose }) => {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={`${title} trailer`}
      className="m-auto w-[min(1100px,calc(100vw-2rem))] overflow-visible bg-transparent p-0 backdrop:bg-night/85 backdrop:backdrop-blur-sm"
    >
      <div className="relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-11 right-0 flex items-center gap-1.5 rounded px-2 py-1 text-sm font-medium text-paper hover:text-bulb"
        >
          Close
          <svg viewBox="0 0 20 20" className="size-4" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
        <div className="aspect-video overflow-hidden rounded-lg bg-black shadow-2xl">
          {open ? (
            <iframe
              className="size-full"
              src={`https://www.youtube-nocookie.com/embed/${videoKey}?autoplay=1&rel=0`}
              title={`${title} trailer`}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          ) : null}
        </div>
      </div>
    </dialog>
  );
};

export default TrailerModal;
