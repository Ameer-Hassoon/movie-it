/** Shared frame + field for the log in and sign up screens. */
export const AuthCard = ({ title, intro, error, children, footer }) => (
  <div className="mx-auto w-full max-w-md px-4 py-12 sm:py-20">
    <div className="rounded-xl border border-line bg-ink p-6 sm:p-8">
      <h1 className="font-display text-5xl font-black leading-none">{title}</h1>
      {intro ? <p className="mt-3 text-muted">{intro}</p> : null}
      {error ? (
        <p role="alert" className="mt-6 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
      {children}
    </div>
    {footer ? <p className="mt-6 text-center text-muted">{footer}</p> : null}
  </div>
);

export const Field = ({ id, label, ...props }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
      {label}
    </label>
    <input
      id={id}
      name={id}
      required
      className="h-11 w-full rounded-md border border-line bg-panel px-3.5 text-paper placeholder:text-muted transition-colors focus:border-bulb focus:outline-none"
      {...props}
    />
  </div>
);

export const SubmitButton = ({ loading, children, loadingText }) => (
  <button
    type="submit"
    disabled={loading}
    className="mt-2 h-11 w-full rounded-md bg-bulb font-semibold text-night transition-colors hover:bg-bulb-deep disabled:cursor-wait disabled:opacity-70"
  >
    {loading ? loadingText : children}
  </button>
);
