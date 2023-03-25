export function isNumeric(value: string): boolean {
  return ((typeof value === 'number' || typeof value === 'string') && !isNaN(Number(value)));
}
