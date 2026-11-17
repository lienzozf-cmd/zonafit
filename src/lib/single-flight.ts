/** Share simultaneous reads; the next call after completion always fetches fresh data. */
export function singleFlight<T>(read: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | undefined;
  return () => {
    if (!pending) {
      pending = Promise.resolve().then(read).finally(() => { pending = undefined; });
    }
    return pending;
  };
}
