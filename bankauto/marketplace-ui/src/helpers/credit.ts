import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { SelectOption } from 'components/Select/Select';
import { CREDIT_PROGRAM_NAME, PRODUCT_SUBTYPE_FIS, PRODUCT_TYPE, PRODUCT_TYPE_FIS } from 'constants/credit';
import {
  EmploymentType,
  EMPLOYMENT_TYPE_FIELDS_MAP,
  EmploymentTypeFis,
  EMPLOYMENT_TYPE_FIELDS_FIS_MAP,
} from 'constants/creditEmployment';
import { CreditProgram } from 'types/CreditProgram';
import { CreditProgramGetterParams } from 'types/CreditProgramParams';
import { Interval, IntervalWithDefault } from 'types/Interval';

type Maybe<T> = Readonly<T> | null;

type ProgramMap = Record<CREDIT_PROGRAM_NAME, (params: CreditProgramGetterParams) => Maybe<CreditProgram>>;

function getInitialPaymentInterval(
  percent: number,
  vehiclePrice: number,
  credit: Interval,
  isMaybePledgeEvery: boolean = false,
  hybrid = false,
): IntervalWithDefault {
  if (hybrid) {
    return {
      min: vehiclePrice > 3_000_000 ? vehiclePrice - 3_000_000 : 0,
      max: Math.floor(vehiclePrice - credit.min),
    };
  }
  return {
    min: isMaybePledgeEvery ? 0 : Math.floor(Math.max(percent * vehiclePrice, vehiclePrice - credit.max)),
    default: isMaybePledgeEvery ? Math.floor(Math.max(percent * vehiclePrice, vehiclePrice - credit.max)) : undefined,
    max: Math.floor(vehiclePrice - credit.min),
  };
}

function getVehicleNewProgram(
  { vehiclePrice }: CreditProgramGetterParams,
  isMaybePledgeEvery: boolean = false,
): Maybe<CreditProgram> {
  if (!vehiclePrice) {
    return null;
  }

  const credit = {
    min: isMaybePledgeEvery ? 100_000 : 300_000,
    max: 8_000_000,
  };

  return {
    name: CREDIT_PROGRAM_NAME.VEHICLE_NEW,
    productType: PRODUCT_TYPE.RGSB_PLEDGE_TRUE,
    productTypeFis: PRODUCT_TYPE_FIS.PLEDGE_TRUE,
    productSubtype: PRODUCT_SUBTYPE_FIS.PLEDGE_TRUE,
    credit,
    term: {
      min: 12,
      max: 84,
    },
    rate: 0.138,
    initialPayment: getInitialPaymentInterval(0.1, vehiclePrice, credit, isMaybePledgeEvery),
  };
}

function getVehicleUsedProgram(
  { vehiclePrice, creditAmount }: CreditProgramGetterParams,
  isMaybePledgeEvery: boolean = false,
): Maybe<CreditProgram> {
  if (!vehiclePrice || !creditAmount) {
    return null;
  }

  const credit = {
    min: isMaybePledgeEvery ? 100_000 : 300_000,
    max: 5_000_000,
  };

  return {
    name: CREDIT_PROGRAM_NAME.VEHICLE_USED,
    productType: PRODUCT_TYPE.RGSB_PLEDGE_TRUE,
    productTypeFis: PRODUCT_TYPE_FIS.PLEDGE_TRUE,
    productSubtype: PRODUCT_SUBTYPE_FIS.PLEDGE_TRUE,
    credit,
    term: {
      min: 12,
      max: 84,
    },
    rate: creditAmount > 1_000_000 ? 0.129 : 0.139,
    initialPayment: getInitialPaymentInterval(0.2, vehiclePrice, credit, isMaybePledgeEvery),
  };
}

function getVehiclePledgeEveryProgram({ vehiclePrice, creditAmount }: CreditProgramGetterParams): Maybe<CreditProgram> {
  if (!vehiclePrice || !creditAmount) {
    return null;
  }

  const credit = {
    min: 100_000,
    max: 3_000_000,
  };

  return {
    name: CREDIT_PROGRAM_NAME.VEHICLE_PLEDGE_EVERY,
    productType: PRODUCT_TYPE.RGSB_PLEDGE_TRUE_EVERY_TS,
    productTypeFis: PRODUCT_TYPE_FIS.PLEDGE_TRUE_ANY,
    productSubtype: PRODUCT_SUBTYPE_FIS.PLEDGE_TRUE_ANY,
    credit,
    term: {
      min: 12,
      max: 84,
    },
    rate: 0.139,
    initialPayment: getInitialPaymentInterval(0, vehiclePrice, credit),
  };
}

function getC2cProgram({ vehiclePrice, creditAmount }: CreditProgramGetterParams): Maybe<CreditProgram> {
  if (!vehiclePrice || !creditAmount) {
    return null;
  }

  const credit = {
    min: 100_000,
    max: 3_000_000,
  };

  return {
    name: CREDIT_PROGRAM_NAME.C2C,
    productType: PRODUCT_TYPE.RGSB_PLEDGE_TRUE_C2C,
    productTypeFis: PRODUCT_TYPE_FIS.PLEDGE_TRUE_C2C,
    credit,
    term: {
      min: 12,
      max: 60,
    },
    rate: creditAmount > 1_500_000 ? 0.059 : 0.069,
    initialPayment: getInitialPaymentInterval(0, vehiclePrice, credit),
  };
}

function getPromoInstalmentProgram({ vehiclePrice }: CreditProgramGetterParams): Maybe<CreditProgram> {
  if (!vehiclePrice) {
    return null;
  }

  const credit = {
    min: 100_000,
    max: 3_000_000,
  };

  return {
    name: CREDIT_PROGRAM_NAME.PROMO_INSTALMENT,
    productType: PRODUCT_TYPE.RGSB_PLEDGE_TRUE_EVERY_TS,
    productTypeFis: PRODUCT_TYPE_FIS.PLEDGE_TRUE_ANY,
    productSubtype: PRODUCT_SUBTYPE_FIS.PROMO_INSTALLMENT,
    promo: 'promo_marketplace_installments',
    credit,
    term: {
      min: 12,
      max: 60,
    },
    rate: 0.139,
    initialPayment: getInitialPaymentInterval(0, vehiclePrice, credit),
  };
}

function getHybridProgram({
  creditAmount,
  justMoney = false,
  isC2C = false,
  initialPayment = 0,
}: CreditProgramGetterParams): Maybe<CreditProgram> {
  if (!creditAmount) {
    return null;
  }

  const credit = {
    min: 50_000,
    max: justMoney ? 3_000_000 : 15_000_000,
  };
  const initialPaymentInterval = getInitialPaymentInterval(0, creditAmount, { min: 50_000, max: 3_000_000 });
  return {
    name: CREDIT_PROGRAM_NAME.HYBRID,
    credit,
    term: {
      min: 13,
      max: 60,
    },
    rate: justMoney || isC2C ? 0.079 : 0.039,
    initialPayment: justMoney ? undefined : initialPaymentInterval,
    currentInitialPayment:
      // eslint-disable-next-line no-nested-ternary
      initialPayment < initialPaymentInterval.min
        ? initialPaymentInterval.min
        : initialPayment > initialPaymentInterval.max
        ? initialPaymentInterval.max
        : initialPayment,
  };
}

function getGeelyProgram({ initialPayment = 0, term, vehiclePrice }: CreditProgramGetterParams): Maybe<CreditProgram> {
  function getRate(creditTerm: number): Maybe<number> {
    if (initialPayment === undefined || !vehiclePrice) return null;
    const initialPaymentPercent = (initialPayment * 100) / vehiclePrice;

    if (creditTerm < 36) {
      if (initialPaymentPercent < 20) return 0.122;
      if (initialPaymentPercent < 30) return 0.079;
      return 0.069;
    }
    if (creditTerm < 48) {
      if (initialPaymentPercent < 20) return 0.122;
      if (initialPaymentPercent < 30) return 0.094;
      return 0.084;
    }
    if (creditTerm < 60) {
      if (initialPaymentPercent < 20) return 0.122;
      if (initialPaymentPercent < 30) return 0.094;
      return 0.084;
    }
    if (creditTerm < 72) {
      if (initialPaymentPercent < 20) return 0.13;
      if (initialPaymentPercent < 30) return 0.099;
      return 0.095;
    }
    if (creditTerm < 84) {
      if (initialPaymentPercent < 20) return 0.135;
      if (initialPaymentPercent < 30) return 0.109;
      return 0.104;
    }

    if (initialPaymentPercent < 20) return 0.135;
    if (initialPaymentPercent < 30) return 0.109;
    return 0.11;
  }

  const rate = getRate(term || 72);

  if (!rate) {
    return null;
  }

  const credit = {
    min: 300_000,
    max: 3_000_000,
  };

  const initialPaymentInterval = getInitialPaymentInterval(0.1, vehiclePrice!, credit, true);

  return {
    name: CREDIT_PROGRAM_NAME.GEELY,
    productType: PRODUCT_TYPE.RGSB_PLEDGE_TRUE,
    productTypeFis: PRODUCT_TYPE_FIS.PLEDGE_TRUE,
    productSubtype: PRODUCT_SUBTYPE_FIS.PROMO_GEELY,
    promo: 'promo_geely',
    credit,
    term: {
      min: 24,
      max: 72,
    },
    rate,
    initialPayment: initialPaymentInterval,
    currentInitialPayment:
      // eslint-disable-next-line no-nested-ternary
      initialPayment < initialPaymentInterval.min
        ? initialPaymentInterval.min
        : initialPayment > initialPaymentInterval.max
        ? initialPaymentInterval.max
        : initialPayment,
  };
}

function getKiaProgram({
  creditAmount,
  initialPayment = 0,
  vehiclePrice,
}: CreditProgramGetterParams): Maybe<CreditProgram> {
  function getRate(): Maybe<number> {
    if (initialPayment === undefined || !vehiclePrice) return null;
    const initialPaymentPercent = (initialPayment * 100) / vehiclePrice;

    if (initialPaymentPercent < 20) return 0.14;
    if (initialPaymentPercent < 30) return 0.13;
    if (initialPaymentPercent < 50) return 0.125;
    return 0.12;
  }

  const rate = getRate();

  if (!creditAmount || !rate) {
    return null;
  }

  const credit = {
    min: 300_000,
    max: 8_000_000,
  };

  const initialPaymentInterval = getInitialPaymentInterval(0.1, vehiclePrice!, credit);

  return {
    name: CREDIT_PROGRAM_NAME.KIA,
    productType: PRODUCT_TYPE.RGSB_PLEDGE_TRUE,
    productTypeFis: PRODUCT_TYPE_FIS.PLEDGE_TRUE,
    productSubtype: PRODUCT_SUBTYPE_FIS.PROMO_KIA_HYUNDAI,
    credit,
    term: {
      min: 24,
      max: 84,
    },
    rate,
    initialPayment: initialPaymentInterval,
    currentInitialPayment:
      // eslint-disable-next-line no-nested-ternary
      initialPayment < initialPaymentInterval.min
        ? initialPaymentInterval.min
        : initialPayment > initialPaymentInterval.max
        ? initialPaymentInterval.max
        : initialPayment,
  };
}

function getHyundaiProgram({
  creditAmount,
  initialPayment = 0,
  vehiclePrice,
}: CreditProgramGetterParams): Maybe<CreditProgram> {
  function getRate(): Maybe<number> {
    if (initialPayment === undefined || !vehiclePrice) return null;
    const initialPaymentPercent = (initialPayment * 100) / vehiclePrice;

    if (initialPaymentPercent < 20) return 0.14;
    if (initialPaymentPercent < 30) return 0.13;
    if (initialPaymentPercent < 50) return 0.125;
    return 0.12;
  }

  const rate = getRate();

  if (!creditAmount || !rate) {
    return null;
  }

  const credit = {
    min: 300_000,
    max: 8_000_000,
  };

  const initialPaymentInterval = getInitialPaymentInterval(0.1, vehiclePrice!, credit);

  return {
    name: CREDIT_PROGRAM_NAME.HYUNDAI,
    productType: PRODUCT_TYPE.RGSB_PLEDGE_TRUE,
    productTypeFis: PRODUCT_TYPE_FIS.PLEDGE_TRUE,
    productSubtype: PRODUCT_SUBTYPE_FIS.PROMO_KIA_HYUNDAI,
    credit,
    term: {
      min: 24,
      max: 84,
    },
    rate,
    initialPayment: initialPaymentInterval,
    currentInitialPayment:
      // eslint-disable-next-line no-nested-ternary
      initialPayment < initialPaymentInterval.min
        ? initialPaymentInterval.min
        : initialPayment > initialPaymentInterval.max
        ? initialPaymentInterval.max
        : initialPayment,
  };
}

function getCaptiveProgram({
  creditAmount,
  initialPayment = 0,
  term,
  vehiclePrice,
}: CreditProgramGetterParams): Maybe<CreditProgram> {
  function getRate(creditTerm: number): Maybe<number> {
    if (initialPayment === undefined || !vehiclePrice) return null;
    const initialPaymentPercent = (initialPayment * 100) / vehiclePrice;

    if (creditTerm < 48) {
      if (initialPaymentPercent < 25) return 0.09;
      if (initialPaymentPercent < 50) return 0.08;
      return 0.06;
    }

    if (initialPaymentPercent < 25) return 0.095;
    if (initialPaymentPercent < 50) return 0.085;
    return 0.065;
  }

  const rate = getRate(term || 84);

  if (!creditAmount || !rate) {
    return null;
  }

  const credit = {
    min: 300_000,
    max: 8_000_000,
  };

  const initialPaymentInterval = getInitialPaymentInterval(0.1, vehiclePrice!, credit, true);

  return {
    name: CREDIT_PROGRAM_NAME.CAPTIVE,
    productType: PRODUCT_TYPE.RGSB_PLEDGE_TRUE,
    productTypeFis: PRODUCT_TYPE_FIS.PLEDGE_TRUE,
    productSubtype: PRODUCT_SUBTYPE_FIS.PROMO_CAPTIVE,
    credit,
    term: {
      min: 12,
      max: 84,
    },
    rate,
    initialPayment: initialPaymentInterval,
    currentInitialPayment:
      // eslint-disable-next-line no-nested-ternary
      initialPayment < initialPaymentInterval.min
        ? initialPaymentInterval.min
        : initialPayment > initialPaymentInterval.max
        ? initialPaymentInterval.max
        : initialPayment,
  };
}

const PROGRAM_MAP: ProgramMap = {
  [CREDIT_PROGRAM_NAME.VEHICLE_NEW]: getVehicleNewProgram,
  [CREDIT_PROGRAM_NAME.VEHICLE_USED]: getVehicleUsedProgram,
  [CREDIT_PROGRAM_NAME.VEHICLE_PLEDGE_EVERY]: getVehiclePledgeEveryProgram,
  [CREDIT_PROGRAM_NAME.C2C]: getC2cProgram,
  [CREDIT_PROGRAM_NAME.PROMO_INSTALMENT]: getPromoInstalmentProgram,
  [CREDIT_PROGRAM_NAME.HYBRID]: getHybridProgram,
  [CREDIT_PROGRAM_NAME.GEELY]: getGeelyProgram,
  [CREDIT_PROGRAM_NAME.KIA]: getKiaProgram,
  [CREDIT_PROGRAM_NAME.HYUNDAI]: getHyundaiProgram,
  [CREDIT_PROGRAM_NAME.CAPTIVE]: getCaptiveProgram,
};

function detectProgram(params: CreditProgramGetterParams): Maybe<CreditProgram> {
  let creditProgram = null;

  if (!params.type || !params.vehiclePrice || !params.year || !params.creditAmount) {
    return null;
  }

  const initialPaymentPercent = ((params.initialPayment || 0) * 100) / params.vehiclePrice;

  if (params.type === VEHICLE_TYPE.NEW) {
    if (params.creditAmount < 300_000) {
      creditProgram = getVehiclePledgeEveryProgram(params);
    } else if (params.vehiclePrice < 3_000_000) {
      creditProgram =
        params.initialPayment !== undefined && initialPaymentPercent < 10
          ? getVehiclePledgeEveryProgram(params)
          : getVehicleNewProgram(params, true);
    } else {
      creditProgram = getVehicleNewProgram(params);
    }
  }

  if (params.type === VEHICLE_TYPE.USED) {
    const age = new Date().getFullYear() - params.year;
    if (age <= 15) {
      if (params.creditAmount < 300_000) {
        creditProgram = getVehiclePledgeEveryProgram(params);
      } else if (params.vehiclePrice < 3_000_000) {
        creditProgram =
          params.initialPayment !== undefined && initialPaymentPercent < 20
            ? getVehiclePledgeEveryProgram(params)
            : getVehicleUsedProgram(params, true);
      } else {
        creditProgram = getVehicleUsedProgram(params);
      }
    } else {
      creditProgram = getVehiclePledgeEveryProgram(params);
    }
  }

  return creditProgram;
}

// public API

function calculateInsurance(creditAmount: number, term: number): number {
  if (!creditAmount || !term) {
    return 0;
  }

  return Math.ceil((creditAmount * 1.1 * 0.002 * term) / (1 - 1.1 * 0.002 * term));
}

function calculateMonthlyPayment(creditAmount: number, term: number, rate: number): number {
  if (!creditAmount || !term || !rate) {
    return 0;
  }

  return Math.ceil((creditAmount * rate) / 12 / (1 - (1 + rate / 12) ** (0 - term)));
}

function calculateMonthlyPaymentWithInsurance(creditAmount: number, term: number, rate: number): number {
  if (!creditAmount || !term || !rate) {
    return 0;
  }

  return calculateMonthlyPayment(creditAmount + calculateInsurance(creditAmount, term), term, rate);
}

function getInitialPaymentByMaxCreditAmount(
  initialPayment: number,
  creditAmount: number,
  term: number,
  creditMax: number,
): number {
  const maxAvailableCreditAmount = Math.ceil(creditMax * (1 - 1.1 * 0.002 * term));

  return creditAmount > maxAvailableCreditAmount ? creditAmount - maxAvailableCreditAmount : initialPayment;
}

function getCreditProgram(params: CreditProgramGetterParams): Maybe<CreditProgram> {
  return params.programName !== undefined ? PROGRAM_MAP[params.programName](params) : detectProgram(params);
}

// TODO: Удалить после отмены БП
function getEmploymentRelatedFields(
  employmentType: EmploymentType,
  data: {
    employerActivity?: string;
    currentJobCategory?: string;
    currentJobPosition?: SelectOption;
    profession?: string;
  },
) {
  const fields = EMPLOYMENT_TYPE_FIELDS_MAP[employmentType];
  let employerActivity = data.employerActivity ? +data.employerActivity : undefined;
  let currentJobCategory = data.currentJobCategory ? +data.currentJobCategory : undefined;
  let currentJobPosition = data.currentJobPosition?.value ? +data.currentJobPosition.value : undefined;
  let profession = data.profession ? +data.profession : undefined;

  if (fields?.employerActivity) {
    employerActivity = +fields.employerActivity;
  }

  if (fields?.currentJobCategory) {
    currentJobCategory = +fields.currentJobCategory;
  }

  if (fields?.currentJobPosition) {
    currentJobPosition = +fields.currentJobPosition;
  }

  if (fields?.profession) {
    profession = +fields.profession;
  }

  return { employerActivity, currentJobCategory, currentJobPosition, profession };
}

function getEmploymentRelatedFieldsFis(
  employmentType: EmploymentTypeFis,
  data: {
    employerActivity?: string;
    currentJobCategory?: string;
    currentJobPosition?: SelectOption;
    profession?: string;
  },
) {
  const fields = EMPLOYMENT_TYPE_FIELDS_FIS_MAP[employmentType];
  let employerActivity = data.employerActivity ? +data.employerActivity : undefined;
  let currentJobCategory = data.currentJobCategory ? +data.currentJobCategory : undefined;
  let currentJobPosition = data.currentJobPosition?.label ? data.currentJobPosition.label : undefined;
  let profession = data.profession ? +data.profession : undefined;

  if (fields?.employerActivity) {
    employerActivity = +fields.employerActivity;
  }

  if (fields?.currentJobCategory) {
    currentJobCategory = +fields.currentJobCategory;
  }

  if (fields?.currentJobPosition) {
    currentJobPosition = fields.currentJobPosition;
  }

  if (fields?.profession) {
    profession = +fields.profession;
  }
  return { employerActivity, currentJobCategory, currentJobPosition, profession };
}

export {
  calculateInsurance,
  calculateMonthlyPayment,
  calculateMonthlyPaymentWithInsurance,
  getInitialPaymentByMaxCreditAmount,
  getCreditProgram,
  getEmploymentRelatedFields,
  getEmploymentRelatedFieldsFis,
};
