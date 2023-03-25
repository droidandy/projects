export function withoutUndefined<T extends Record<string, any>>(obj: T): T {
  const result = { ...obj };
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === undefined) {
      delete result[key];
    }
  }

  return result;
}
