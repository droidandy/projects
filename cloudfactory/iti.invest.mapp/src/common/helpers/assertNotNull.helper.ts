export function assertNotNull<T>(item: T | null | undefined, message?: string): T {
  if (item === null || item === undefined) {
    throw new Error(
      '[assertNotNull] Object can not be null or undefined.' +
        (message ? '  ' + message : ''),
    );
  }

  return item;
}
