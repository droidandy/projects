import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';

import { PRODUCT_TYPE } from 'constants/credit';
import { clamp } from 'helpers/clamp';

const ROUND_ORDER = 10 ** 4;

interface CarInfo {
  price: number;
  type?: VEHICLE_TYPE;
  productionYear?: number;
  isC2c?: boolean;
}

type INTERVAL = {
  MIN: number;
  MAX: number;
};

function calculateInsurance(creditAmount: number, months: number) {
  return (creditAmount * 1.1 * 0.002 * months) / (1 - 1.1 * 0.002 * months);
}

export const GET_CREDIT_PROGRAM = ({
  price,
  type = VEHICLE_TYPE.NEW,
  productionYear = new Date().getFullYear(),
  isC2c = false,
}: CarInfo) => {
  const age = new Date().getFullYear() - productionYear;

  let program: any;
  if (isC2c) {
    program = CREDIT_PROGRAM.C2C_CAR(price);
  } else if (type === VEHICLE_TYPE.NEW) {
    program = CREDIT_PROGRAM.NEW_CAR();
  } else if (age <= 10 && price >= 10 ** 6) {
    program = CREDIT_PROGRAM.USED_CAR();
  } else {
    program = CREDIT_PROGRAM.USED_OLD_CAR();
  }

  program.INITIAL_PAYMENT = program.INITIAL_PAYMENT(price);
  program.INITIAL_PAYMENT.MAX = Math.floor(Math.max(0, program.INITIAL_PAYMENT.MAX) / ROUND_ORDER) * ROUND_ORDER;
  program.INITIAL_PAYMENT.MIN =
    Math.ceil(clamp(0, program.INITIAL_PAYMENT.MIN, program.INITIAL_PAYMENT.MAX) / ROUND_ORDER) * ROUND_ORDER;

  program.CREDIT_PER_MONTH = (months: number, initialPayment: number) => {
    const vehiclePrice = price - initialPayment;
    const insurance = calculateInsurance(vehiclePrice, months);
    const creditAmount = isC2c ? vehiclePrice + insurance : vehiclePrice;
    return Math.ceil(
      (creditAmount * program.CREDIT_PERCENT) / 12 / (1 - (1 + program.CREDIT_PERCENT / 12) ** (0 - months)),
    );
  };

  return program as CREDIT_PROGRAM_TYPE;
};

export type CREDIT_PROGRAM_TYPE = {
  PRODUCT_TYPE: PRODUCT_TYPE;
  CREDIT: INTERVAL;
  INITIAL_PAYMENT: INTERVAL;
  MONTHS: INTERVAL;
  CREDIT_PERCENT: number;
  INCREASING_PERCENT: number;
  CREDIT_PER_MONTH: (months: number, initialPayment: number) => number;
};
export const CREDIT_PROGRAM = {
  NEW_CAR: () => ({
    PRODUCT_TYPE: PRODUCT_TYPE.RGSB_PLEDGE_TRUE,
    CREDIT: {
      MIN: 0.3 * 10 ** 6,
      MAX: 7.0 * 10 ** 6,
    },
    INITIAL_PAYMENT(price: number) {
      return {
        MIN: Math.floor(Math.max(0.1 * price, price - this.CREDIT.MAX)),
        MAX: Math.floor(price - this.CREDIT.MIN),
      };
    },
    MONTHS: {
      MIN: 12,
      MAX: 84,
    },
    CREDIT_PERCENT: 0.159,
    INCREASING_PERCENT: 1,
  }),
  USED_CAR: () => ({
    PRODUCT_TYPE: PRODUCT_TYPE.RGSB_PLEDGE_TRUE,
    CREDIT: {
      MIN: 0.3 * 10 ** 6,
      MAX: 4.0 * 10 ** 6,
    },
    INITIAL_PAYMENT(price: number) {
      return {
        MIN: Math.floor(Math.max(0.2 * price, 0.3 * 10 ** 6, price - this.CREDIT.MAX)),
        MAX: Math.floor(price - this.CREDIT.MIN),
      };
    },
    MONTHS: {
      MIN: 12,
      MAX: 60,
    },
    CREDIT_PERCENT: 0.159,
    INCREASING_PERCENT: 1,
  }),
  USED_OLD_CAR: () => ({
    PRODUCT_TYPE: PRODUCT_TYPE.RGSB_PLEDGE_TRUE_EVERY_TS,
    CREDIT: {
      MIN: 0.1 * 10 ** 6,
      MAX: 1.0 * 10 ** 6,
    },
    INITIAL_PAYMENT(price: number) {
      return {
        MIN: Math.floor(Math.max(0, price - this.CREDIT.MAX)),
        MAX: Math.floor(price - this.CREDIT.MIN),
      };
    },
    MONTHS: {
      MIN: 12,
      MAX: 60,
    },
    CREDIT_PERCENT: 0.149,
    INCREASING_PERCENT: 1,
  }),
  C2C_CAR: (price: number) => ({
    PRODUCT_TYPE: PRODUCT_TYPE.RGSB_PLEDGE_TRUE_C2C,
    CREDIT: {
      MIN: 100000,
      MAX: 2.5 * 10 ** 6,
    },
    INITIAL_PAYMENT(price: number) {
      return {
        MIN: Math.floor(Math.max(0, price - this.CREDIT.MAX)),
        MAX: Math.floor(price - this.CREDIT.MIN),
      };
    },
    MONTHS: {
      MIN: 12,
      MAX: 60,
    },
    CREDIT_PERCENT: price > 1_500_000 ? 0.089 : 0.099,
    INCREASING_PERCENT: 1,
  }),
};
