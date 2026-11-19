import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import Logo from "./Logo";
import Avatar from "./Avatar";

const links = [
  { to: "/", label: "Movies", end: true },
  { to: "/tv", label: "Shows" },
  { to: "/people", label: "People" },
];

const navClass = ({ isActive }) =>
  [
    "relative flex h-full items-center px-3 text-[0.95rem] font-medium transition-colors",
    "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors",
    isActive
      ? "text-paper after:bg-bulb"
      : "text-muted hover:text-paper after:bg-transparent",
  ].join(" ");

export const TopBar = () => {
  const { isAuthenticated, currentUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-bulb focus:px-3 focus:py-1.5 focus:text-night"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-stretch gap-2 px-4 sm:gap-6 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Movie It home">
          <Logo className="size-8" />
          <span className="hidden font-display text-2xl font-extrabold tracking-wide sm:block">
            Movie It
          </span>
        </Link>

        <nav aria-label="Main" className="flex items-stretch">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center">
          {isAuthenticated ? (
            <Link to="/profile" aria-label="Your profile" className="rounded-full">
              <Avatar name={currentUser?.name} className="size-9 text-sm" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-md px-3 py-2 text-[0.95rem] font-medium text-paper transition-colors hover:bg-panel"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
