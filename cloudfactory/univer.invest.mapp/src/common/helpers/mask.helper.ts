export interface IMaskStrConfig {
  start?: number;
  end?: number;
  shift?: number;
  symbol: string;
}

export function maskStr(str?: string, cfg: IMaskStrConfig = { symbol: '*' }) {
// TODO need refactoring
  let shift = '';
  if (!str) return '';
  if (cfg.shift) {
    shift = str.slice(0, cfg.shift);
    str = str.slice(cfg.shift);
  }
  if (cfg.start) str = shift + str.replace(new RegExp(`^\.{${cfg.start}}`), cfg.symbol.repeat(cfg.start));
  if (cfg.end) str = str.replace(new RegExp(`\.{${cfg.end}}$`), cfg.symbol.repeat(cfg.end));
  return str;
}

export function firstLetter(str?: string) {
  if (!str) return '';
  return str.slice(0, 1) + '.';
}
