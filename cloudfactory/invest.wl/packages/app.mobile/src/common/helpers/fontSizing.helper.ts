export function fontSizing(size: number): any {
  return {
    fontSize: size, lineHeight: size + 1,
    marginBottom: -Math.floor(size / 10),
  };
}
