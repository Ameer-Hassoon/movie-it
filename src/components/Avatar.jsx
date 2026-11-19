function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

const Avatar = ({ name, className = "size-9" }) => (
  <span
    className={`inline-flex items-center justify-center rounded-full bg-bulb font-semibold text-night ${className}`}
    aria-hidden="true"
  >
    {initials(name)}
  </span>
);

export default Avatar;
