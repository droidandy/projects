export function deepEquals(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}
