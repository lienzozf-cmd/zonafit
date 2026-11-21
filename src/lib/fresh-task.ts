/** Share active refreshes and skip recent successes without replaying stale data. */
export function freshTask(
  task: (force: boolean) => Promise<void>,
  maxAgeMs: number,
  now: () => number = Date.now,
): (force?: boolean) => Promise<void> {
  let pending: Promise<void> | undefined;
  let pendingForced = false;
  let lastSuccess: number | undefined;
  function refresh(force = false): Promise<void> {
    if (pending) {
      // A purchase must not reuse a read that started before the purchase completed.
      if (force && !pendingForced) return pending.catch(() => {}).then(() => refresh(true));
      return pending;
    }
    if (!force && lastSuccess !== undefined && now() - lastSuccess < maxAgeMs) return Promise.resolve();
    pendingForced = force;
    pending = Promise.resolve().then(() => task(force)).then(() => {
      lastSuccess = now();
    }).finally(() => { pending = undefined; });
    return pending;
  }
  return refresh;
}
