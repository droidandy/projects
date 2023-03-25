import debounce from 'lodash/debounce';

export const asyncDebounce = (func: Function, wait: number) => {
  const debounced = debounce((resolve, reject, args) => {
    func(...args)
      .then(resolve)
      .catch(reject);
  }, wait);
  return (...args: any[]) =>
    new Promise((resolve, reject) => {
      debounced(resolve, reject, args);
    });
};
