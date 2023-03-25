export const DEPOSIT_MIN_AMOUNT = 30_000;
export const DEPOSIT_MAX_AMOUNT = 5_000_000;

// 27 steps from 30_000 to 300_000
// 14 steps from 300_000 to 1_000_000
// 40 steps from 1_000_000 to 5_000_000
export const DEPOSIT_MAP = [
  {
    value: 0,
    scaledValue: 30_000,
  },
  {
    value: 27,
    scaledValue: 300_000,
  },
  {
    value: 27 + 14,
    scaledValue: 1_000_000,
  },
  {
    value: 27 + 14 + 40,
    scaledValue: 5_000_000,
  },
];

export const DEPOSIT_MIN_TERM = 3;
export const DEPOSIT_MAX_TERM = 24;
