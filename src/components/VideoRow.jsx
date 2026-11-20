/** Thumbnails that open the shared video modal. */
const VideoRow = ({ videos, onPlay }) => {
  if (videos.length < 2) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6" aria-labelledby="videos">
      <h2 id="videos" className="font-display text-3xl font-extrabold">
        Videos
      </h2>
      <ul className="scroll-row -mx-4 mt-4 flex scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-px-6 sm:px-6">
        {videos.map((v) => (
          <li key={v.key} className="w-64 shrink-0 snap-start sm:w-72">
            <button type="button" onClick={() => onPlay(v)} className="group block w-full rounded-md text-left">
              <span className="relative block aspect-video overflow-hidden rounded-md bg-panel ring-1 ring-line transition group-hover:ring-2 group-hover:ring-bulb">
                <img
                  src={`https://i.ytimg.com/vi/${v.key}/hqdefault.jpg`}
                  alt=""
                  loading="lazy"
                  className="size-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-night/20 transition-colors group-hover:bg-night/0">
                  <span className="flex size-12 items-center justify-center rounded-full bg-night/75 text-paper ring-1 ring-white/20 transition-colors group-hover:bg-bulb group-hover:text-night">
                    <svg viewBox="0 0 20 20" className="ml-0.5 size-5" fill="currentColor" aria-hidden="true">
                      <path d="M6 4l10 6-10 6z" />
                    </svg>
                  </span>
                </span>
              </span>
              <span className="mt-2 line-clamp-2 block font-medium leading-snug text-paper">{v.name}</span>
              <span className="text-sm text-muted">{v.type}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default VideoRow;
