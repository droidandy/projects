export const contrastColor = <T>(color: string, light: T, dark: T, threshold?: number): T => {
  const num = parseInt(color.replace('#', ''), 16),
    R = num >> 16,
    B = (num >> 8) & 0x00ff,
    G = num & 0x0000ff;
  const brightness = (R * 299 + G * 587 + B * 114) / 255000;
  return brightness >= (threshold || 0.5) ? dark : light;
};
