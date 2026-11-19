import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useWatchlist } from "../context/useWatchlist";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { BookmarkIcon } from "./WatchlistButton";

const links = [
  { to: "/movies", label: "Movies" },
  { to: "/tv", label: "Shows" },
  { to: "/people", label: "People" },
];

const navClass = ({ isActive }) =>
  [
    "relative flex h-full items-center px-2.5 text-[0.95rem] font-medium transition-colors sm:px-3",
    "after:absolute after:inset-x-2.5 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors sm:after:inset-x-3",
    isActive ? "text-paper after:bg-bulb" : "text-muted hover:text-paper after:bg-transparent",
  ].join(" ");

export const TopBar = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const { count } = useWatchlist();

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-ink/90 backdrop-blur-md">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded focus:bg-bulb focus:px-3 focus:py-1.5 focus:text-night"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-stretch gap-1 px-4 sm:gap-6 sm:px-6">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Movie It home">
          <Logo className="size-8" />
          <span className="hidden font-display text-2xl font-extrabold tracking-wide sm:block">Movie It</span>
        </Link>

        <nav aria-label="Main" className="flex items-stretch">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={navClass}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <NavLink
            to="/watchlist"
            aria-label={`Watchlist, ${count} saved`}
            className={({ isActive }) =>
              `relative flex items-center gap-2 rounded-md px-2 py-2 text-[0.95rem] font-medium transition-colors hover:bg-panel sm:px-3 ${
                isActive ? "text-bulb" : "text-paper"
              }`
            }
          >
            <BookmarkIcon filled={count > 0} className="size-5" />
            <span className="hidden md:inline">Watchlist</span>
            {count > 0 ? (
              <span className="absolute -right-0.5 top-0.5 min-w-4.5 rounded-full bg-bulb px-1 text-center text-[0.7rem] font-bold leading-4.5 text-night md:static md:text-xs">
                {count}
              </span>
            ) : null}
          </NavLink>
          {isAuthenticated ? (
            <Link to="/profile" aria-label="Your profile" className="rounded-full">
              <Avatar name={currentUser?.name} className="size-9 text-sm" />
            </Link>
          ) : (
            <Link
              to="/login"
              className="whitespace-nowrap rounded-md px-2 py-2 text-[0.95rem] font-medium text-paper transition-colors hover:bg-panel sm:px-3"
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
