type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;

export const safely = async <
  F extends (...args: any) => Promise<any>,
  A extends Parameters<F>,
  R extends ThenArg<ReturnType<F>>,
>(
  promise: F,
  ...params: A
): Promise<R | null> => {
  let result: R | null = null;
  try {
    result = await promise(params);
  } catch (err) {
    // console.log(err)
  }
  return result;
};
