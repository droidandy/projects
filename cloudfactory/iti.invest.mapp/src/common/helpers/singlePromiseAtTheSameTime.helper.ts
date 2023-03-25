/**
 * Декоратор не разрешает запустить более одной асинхронной операции одновременно.
 * Если операция уже выполняется, метод вернёт один и тот же промис при каждом вызове.
 */
const singlePromiseAtTheSameTimeDecoratorFactory = () => {
  const resultPromiseKey = Symbol();

  return (target: any, key: string, descriptor?: PropertyDescriptor) => {
    if (!descriptor) {
      descriptor = Object.getOwnPropertyDescriptor(target, key)!;
    }
    const originalMethod = descriptor.value;

    descriptor.value = function fn(...args: any[]) {
      let currentPromise = (this as any)[resultPromiseKey];
      // если запрос прямо сейчас не выполняется, вызываем оригинальный метод, иначе возвращаем текущий промис
      if (!currentPromise) {
        currentPromise = (this as any)[resultPromiseKey] = originalMethod.apply(this, args)
          .then((result: any) => {
            currentPromise = (this as any)[resultPromiseKey] = undefined;
            return result;
          })
          .catch((error: Error) => {
            currentPromise = (this as any)[resultPromiseKey] = undefined;
            return Promise.reject(error);
          });
      }

      return currentPromise;
    };

    return descriptor;
  };
};

export const singlePromiseAtTheSameTime = singlePromiseAtTheSameTimeDecoratorFactory;
