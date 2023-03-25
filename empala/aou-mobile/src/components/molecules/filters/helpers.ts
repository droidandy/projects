import { FilterDirection } from './types';

export const calculateNextDirection = (direction?: FilterDirection): FilterDirection => {
  if (typeof direction === 'undefined' || direction === FilterDirection.disabled) return FilterDirection.down;
  if (direction === FilterDirection.down) return FilterDirection.up;

  return FilterDirection.disabled;
};
