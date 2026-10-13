export type SettledPromise<T> = Promise<PromiseSettledResult<T>>;

export function settlePromise<T>(
  promise: Promise<T>,
): SettledPromise<T> {
  return promise.then(
    (value): PromiseFulfilledResult<T> => ({ status: 'fulfilled', value }),
    (reason: unknown): PromiseRejectedResult => ({
      status: 'rejected',
      reason,
    }),
  );
}
