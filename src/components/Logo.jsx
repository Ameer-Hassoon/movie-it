// Redrawn from the original raster logo: a film-reel "C" around a play mark.
const Logo = ({ className = "size-8" }) => (
  <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
    <path
      d="M24.4 8.6A10.6 10.6 0 1 0 24.4 23.4"
      fill="none"
      stroke="var(--color-bulb)"
      strokeWidth="4.4"
      strokeLinecap="round"
    />
    {/* sprocket holes */}
    <path
      d="M24.4 8.6A10.6 10.6 0 1 0 24.4 23.4"
      fill="none"
      stroke="var(--color-ink)"
      strokeWidth="1.6"
      strokeDasharray="1.4 3"
      strokeLinecap="round"
    />
    <path d="M13.4 11.2v9.6l7.6-4.8z" fill="var(--color-bulb)" />
  </svg>
);

export default Logo;
