import { onBecomeObserved, onBecomeUnobserved } from 'mobx';

export function whenObserved<T extends Record<string, any>, R>(obj: T, propeprty: keyof T, onObserved: () => R, onUnobserved?: (res: R) => void) {
  let res: R;
  onBecomeObserved(obj, propeprty, () => {
    res = onObserved();
  });
  if (onUnobserved) {
    onBecomeUnobserved(obj, propeprty, () => {
      onUnobserved(res);
    });
  }
}
