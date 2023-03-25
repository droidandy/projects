import { numberIsZero } from './number.util';

export function divide(num?: number, divider?: number) {
  return !num || !divider || numberIsZero(divider) ? 0 : num / divider;
}

export function subtract(num?: number, sub?: number) {
  return (num || 0) - (sub || 0);
}

export class MathUtil {
  public static divide = divide;
  public static subtract = subtract;
}
