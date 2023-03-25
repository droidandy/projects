/**
 * Используется при отладке, чтобы выяснить кто вызвал тот или оной метод/функцию.
 */
export function getStack() {
  if (!__DEV__) {
    throw new Error('Do not use getStack in production!');
  }
  // console.trace()
  const err = new Error();
  return err.stack;
}
