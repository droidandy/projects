export enum Period {
  d = '1d',
  w = '1w',
  m = '1m',
  m6 = '6m',
  y = '1y',
  y3 = '3y',
  y5 = '5y',
  ytd = 'ytd',
  all = 'all',
}

export type DataTick = {
  date: number;
  price: number;
};

export enum ChartMode {
  line,
  candle,
}
