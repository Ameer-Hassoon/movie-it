import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
    <p className="font-display text-[9rem] font-black leading-none text-bulb">404</p>
    <h1 className="mt-2 font-display text-4xl font-extrabold">This page isn't showing</h1>
    <p className="mt-3 text-muted">The link may be broken, or the page was removed.</p>
    <Link
      to="/"
      className="mt-8 rounded-md bg-bulb px-5 py-3 font-semibold text-night transition-colors hover:bg-bulb-deep"
    >
      Browse movies
    </Link>
  </div>
);

export default NotFound;
