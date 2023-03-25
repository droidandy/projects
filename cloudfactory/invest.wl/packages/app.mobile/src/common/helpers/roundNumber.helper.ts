export function roundNumber(n: number, precision: number = 0) {
  const mult = Math.pow(10, precision);

  return Math.round(n * mult) / mult;
}
