import { useEffect, useState } from "react";

/**
 * Runs an async function and tracks {data, error, loading}.
 *
 * Every run gets its own AbortController. The controller is aborted on cleanup
 * (dep change or unmount), so a slow response from an older run can never
 * overwrite the result of a newer one. AbortError is swallowed.
 *
 * @param {(signal: AbortSignal) => Promise<any>} fn
 * @param {any[]} deps
 */
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError(null);

    Promise.resolve()
      .then(() => fn(controller.signal))
      .then((result) => {
        if (!active || controller.signal.aborted) return;
        setData(result);
      })
      .catch((err) => {
        if (!active || controller.signal.aborted) return;
        if (err?.name === "AbortError") return;
        setError(err);
      })
      .finally(() => {
        if (!active || controller.signal.aborted) return;
        setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
    // fn is intentionally not a dependency: callers pass a fresh closure each
    // render and drive re-runs through the explicit deps array.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, error, loading };
}
