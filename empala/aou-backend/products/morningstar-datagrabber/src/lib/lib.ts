export const unionArraysUnique = (...args: any[]): any[] => {
  let result: any[] = [];
  args.forEach((arr: any[]) => {
    result = [...new Set([...result, ...arr])];
  });
  return result;
};

export const arrayAMinusB = (a: any[], b: any[]) => a.filter((v) => !b.includes(v));

export const sleep = (timeOut: number) => new Promise((resolve) => {
  setTimeout(resolve, timeOut);
});

/**
 * Logs the error and throws an exception
 */
export const error = (err: string | Error | any): void => {
  if (typeof err === 'string') {
    err = new Error(err);
  }
  err[Symbol.for('noExposeCodeFrame')] = true;
  throw err;
};
