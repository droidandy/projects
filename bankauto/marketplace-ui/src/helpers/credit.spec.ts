import { CREDIT_PROGRAM_NAME } from 'constants/credit';
import { EmploymentType } from 'constants/creditEmployment';
import {
  getCreditProgram,
  calculateInsurance,
  calculateMonthlyPayment,
  calculateMonthlyPaymentWithInsurance,
  getInitialPaymentByMaxCreditAmount,
  getEmploymentRelatedFields,
} from './credit';

jest.mock('@marketplace/ui-kit/types', () => ({
  VEHICLE_TYPE: {
    NEW: 'new',
    USED: 'used',
  },
}));

describe('credit', () => {
  it('should not return any credit program', () => {
    const creditProgram = getCreditProgram({});

    expect(creditProgram).toBeNull();
  });

  it('should return vehicle new program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.VEHICLE_NEW, vehiclePrice: 1_000_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.VEHICLE_NEW);
  });

  it('should return vehicle used program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.VEHICLE_USED, vehiclePrice: 1_000_000, creditAmount: 1_000_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.VEHICLE_USED);
  });

  it('should return pledge every program', () => {
    const params = {
      programName: CREDIT_PROGRAM_NAME.VEHICLE_PLEDGE_EVERY,
      vehiclePrice: 1_000_000,
      creditAmount: 500_000,
    };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.VEHICLE_PLEDGE_EVERY);
  });

  it('should return c2c program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.C2C, vehiclePrice: 1_000_000, creditAmount: 1_000_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.C2C);
  });

  it('should return instalment program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.PROMO_INSTALMENT, vehiclePrice: 1_000_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.PROMO_INSTALMENT);
  });

  it('should return hybrid program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.HYBRID, creditAmount: 1_000_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.HYBRID);
  });

  it('should return null if no type', () => {
    const params = { vehiclePrice: 1_000_000, year: 2018 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram).toBeNull();
  });

  it('should return null if no price', () => {
    const params = { type: 'used', year: 2018 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram).toBeNull();
  });

  it('should return null if no year', () => {
    const params = { type: 'used', vehiclePrice: 1_000_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram).toBeNull();
  });

  it('should return vehicle every program without specify explicitly', () => {
    const params = { type: 'new', vehiclePrice: 1_000_000, creditAmount: 800_000, year: 2021, initialPayment: 0 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.VEHICLE_PLEDGE_EVERY);
  });

  it('should return vehicle new program without specify explicitly', () => {
    const params = {
      type: 'new',
      vehiclePrice: 1_000_000,
      creditAmount: 800_000,
      year: 2021,
      initialPayment: 0.1 * 1_000_000,
    };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.VEHICLE_NEW);
  });

  it('should return pledge every program without specify explicitly and low price', () => {
    const params = { type: 'new', vehiclePrice: 300_000, creditAmount: 250_000, year: 2020 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.VEHICLE_PLEDGE_EVERY);
  });

  it('should return vehicle every program without specify explicitly', () => {
    const params = { type: 'used', vehiclePrice: 1_500_000, creditAmount: 1_300_000, year: 2018, initialPayment: 0 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.VEHICLE_PLEDGE_EVERY);
  });

  it('should return vehicle used program without specify explicitly', () => {
    const params = {
      type: 'used',
      vehiclePrice: 1_500_000,
      creditAmount: 1_300_000,
      year: 2018,
      initialPayment: 0.2 * 1_500_000,
    };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.VEHICLE_USED);
  });

  it('should return pledge every program without specify explicitly and old year', () => {
    const params = { type: 'used', vehiclePrice: 1_500_000, creditAmount: 1_000_000, year: 2003 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.VEHICLE_PLEDGE_EVERY);
  });

  it('should return pledge every program without specify explicitly and low price', () => {
    const params = { type: 'used', vehiclePrice: 300_000, creditAmount: 250_000, year: 2020 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.VEHICLE_PLEDGE_EVERY);
  });

  it('should return null if there is no price', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.VEHICLE_NEW };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram).toBeNull();
  });

  it('should return right insurance', () => {
    const amount = 1_000_000;
    const term = 64;

    const insuranceAmount = calculateInsurance(amount, term);

    expect(insuranceAmount).toEqual(163874);
  });

  it('should return zero insurance if no term', () => {
    const amount = 1_000_000;

    const insuranceAmount = calculateInsurance(amount, 0);

    expect(insuranceAmount).toEqual(0);
  });

  it('should return zero insurance if no amount', () => {
    const term = 64;

    const insuranceAmount = calculateInsurance(0, term);

    expect(insuranceAmount).toEqual(0);
  });

  it('should return right monthly payment', () => {
    const amount = 1_000_000;
    const term = 64;
    const rate = 0.139;

    const monthlyPayment = calculateMonthlyPayment(amount, term, rate);

    expect(monthlyPayment).toEqual(22213);
  });

  it('should return zero monthly payment if no term', () => {
    const amount = 1_000_000;
    const term = 0;
    const rate = 0.139;

    const monthlyPayment = calculateMonthlyPayment(amount, term, rate);

    expect(monthlyPayment).toEqual(0);
  });

  it('should return zero monthly payment if no amount', () => {
    const amount = 0;
    const term = 32;
    const rate = 0.139;

    const monthlyPayment = calculateMonthlyPayment(amount, term, rate);

    expect(monthlyPayment).toEqual(0);
  });

  it('should return zero monthly payment if no rate', () => {
    const amount = 1_000_000;
    const term = 32;
    const rate = 0;

    const monthlyPayment = calculateMonthlyPayment(amount, term, rate);

    expect(monthlyPayment).toEqual(0);
  });

  it('should return correct initial payment for new program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.VEHICLE_NEW, vehiclePrice: 950_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.initialPayment).toBeTruthy();
    expect(creditProgram.initialPayment.min).toEqual(95_000);
    expect(creditProgram.initialPayment.max).toEqual(650_000);
  });

  it('should return correct initial payment for new program with price more than credit max', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.VEHICLE_NEW, vehiclePrice: 30_000_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.initialPayment).toBeTruthy();
    expect(creditProgram.initialPayment.min).toEqual(22_000_000);
    expect(creditProgram.initialPayment.max).toEqual(29_700_000);
  });

  it('should return null for used program if no creditAmount', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.VEHICLE_USED, vehiclePrice: 950_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram).toBeNull();
  });

  it('should return correct rate for cheap vehicle for used program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.VEHICLE_USED, vehiclePrice: 950_000, creditAmount: 300_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.rate).toEqual(0.139);
  });

  it('should return correct rate for expensive vehicle for used program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.VEHICLE_USED, vehiclePrice: 2_500_000, creditAmount: 2_000_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.rate).toEqual(0.129);
  });

  it('should return correct rate for expensive vehicle and low credit program for used program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.VEHICLE_USED, vehiclePrice: 2_500_000, creditAmount: 800_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.rate).toEqual(0.139);
  });

  it('should return correct initial payment for used program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.VEHICLE_USED, vehiclePrice: 950_000, creditAmount: 500_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.initialPayment).toBeTruthy();
    expect(creditProgram.initialPayment.min).toEqual(190_000);
    expect(creditProgram.initialPayment.max).toEqual(650_000);
  });

  it('should return correct initial payment for pledge every program', () => {
    const params = {
      programName: CREDIT_PROGRAM_NAME.VEHICLE_PLEDGE_EVERY,
      vehiclePrice: 950_000,
      creditAmount: 650_000,
    };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.initialPayment).toBeTruthy();
    expect(creditProgram.initialPayment.min).toEqual(0);
    expect(creditProgram.initialPayment.max).toEqual(850_000);
  });

  it('should return correct rate for cheap vehicle for c2c program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.C2C, vehiclePrice: 1_500_000, creditAmount: 1_500_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.rate).toEqual(0.069);
  });

  it('should return correct rate for expensive vehicle for c2c program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.C2C, vehiclePrice: 1_501_000, creditAmount: 1_501_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.rate).toEqual(0.059);
  });

  it('should return correct rate for expensive vehicle and low credit amount for c2c program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.C2C, vehiclePrice: 2_500_000, creditAmount: 500_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.rate).toEqual(0.069);
  });

  it('should return correct initial payment for c2c program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.C2C, vehiclePrice: 950_000, creditAmount: 950_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.initialPayment).toBeTruthy();
    expect(creditProgram.initialPayment.min).toEqual(0);
    expect(creditProgram.initialPayment.max).toEqual(850_000);
  });

  it('should return correct initial payment for instalment program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.PROMO_INSTALMENT, vehiclePrice: 950_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.initialPayment).toBeTruthy();
    expect(creditProgram.initialPayment.min).toEqual(0);
    expect(creditProgram.initialPayment.max).toEqual(850_000);
  });

  it('should return null for hybrid program if no amount', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.HYBRID };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram).toBeNull();
  });

  it('should return correct max credit for hybrid program if client just needs money', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.HYBRID, creditAmount: 900_000, justMoney: true };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.credit.max).toEqual(3_000_000);
  });

  it('should return correct max credit for hybrid program if client needs vehicle', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.HYBRID, creditAmount: 1_500_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.credit.max).toEqual(15_000_000);
  });

  it('should return correct rate for hybrid program if client just needs money', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.HYBRID, creditAmount: 900_000, justMoney: true };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.rate).toEqual(0.079);
  });

  it('should return correct rate for hybrid program if client needs vehicle', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.HYBRID, creditAmount: 1_500_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.rate).toEqual(0.039);
  });

  it('should not return initial payment for hybrid program if client just needs money', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.HYBRID, creditAmount: 900_000, justMoney: true };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.initialPayment).toBeUndefined();
  });

  it('should return correct initial payment for hybrid program', () => {
    const params = { programName: CREDIT_PROGRAM_NAME.HYBRID, creditAmount: 950_000 };

    const creditProgram = getCreditProgram(params);

    expect(creditProgram.initialPayment).toBeTruthy();
    expect(creditProgram.initialPayment.min).toEqual(0);
    expect(creditProgram.initialPayment.max).toEqual(900_000);
  });

  it('should return correct monthly payment with insurance', () => {
    const amount = 1_000_000;
    const term = 60;
    const rate = 0.129;

    const monthlyPayment = calculateMonthlyPaymentWithInsurance(amount, term, rate);

    expect(monthlyPayment).toEqual(26_155);
  });

  it('should return zero if no rate', () => {
    const amount = 1_000_000;
    const term = 60;
    const rate = 0;

    const monthlyPayment = calculateMonthlyPaymentWithInsurance(amount, term, rate);

    expect(monthlyPayment).toEqual(0);
  });

  it('should return zero if no amount', () => {
    const amount = 0;
    const term = 60;
    const rate = 0.129;

    const monthlyPayment = calculateMonthlyPaymentWithInsurance(amount, term, rate);

    expect(monthlyPayment).toEqual(0);
  });

  it('should return zero if no term', () => {
    const amount = 1_000_000;
    const term = 0;
    const rate = 0.129;

    const monthlyPayment = calculateMonthlyPaymentWithInsurance(amount, term, rate);

    expect(monthlyPayment).toEqual(0);
  });

  it('should return min initialPayment if amount < maxAmount', () => {
    const initialPayment = 500_000;
    const creditAmount = 5_000_000;
    const term = 84;
    const creditMax = 8_000_000;

    const newInitialPayment = getInitialPaymentByMaxCreditAmount(initialPayment, creditAmount, term, creditMax);

    expect(newInitialPayment).toEqual(initialPayment);
  });

  it('should return min initialPayment if amount = maxAmount', () => {
    const initialPayment = 800_000;
    const creditAmount = 6_521_600;
    const term = 84;
    const creditMax = 8_000_000;

    const newInitialPayment = getInitialPaymentByMaxCreditAmount(initialPayment, creditAmount, term, creditMax);

    expect(newInitialPayment).toEqual(initialPayment);
  });

  it('should return correct initialPayment if amount > maxAmount', () => {
    const initialPayment = 750_000;
    const creditAmount = 7_500_000;
    const term = 84;
    const creditMax = 8_000_000;

    const newInitialPayment = getInitialPaymentByMaxCreditAmount(initialPayment, creditAmount, term, creditMax);

    expect(newInitialPayment).toEqual(978_400);
  });

  it('should return correct fields for enterpreneur employment type', () => {
    const expectedFields = { currentJobCategory: 2, currentJobPosition: 375, profession: 19 };

    const fields = getEmploymentRelatedFields(EmploymentType.ENTREPRENEUR, {});

    expect(fields).toEqual(expectedFields);
  });

  it('should return correct fields for military type', () => {
    const expectedFields = { employerActivity: 1, currentJobCategory: 8, currentJobPosition: 51, profession: 2 };

    const fields = getEmploymentRelatedFields(EmploymentType.MILITARY, {});

    expect(fields).toEqual(expectedFields);
  });

  it('should return correct fields for business type', () => {
    const expectedFields = { currentJobCategory: 1 };

    const fields = getEmploymentRelatedFields(EmploymentType.BUSINESS, {});

    expect(fields).toEqual(expectedFields);
  });

  it('should return correct fields for lawyer type', () => {
    const expectedFields = { currentJobCategory: 3 };

    const fields = getEmploymentRelatedFields(EmploymentType.LAWYER, {});

    expect(fields).toEqual(expectedFields);
  });

  it('should return correct fields for notary type', () => {
    const expectedFields = { currentJobCategory: 3 };

    const fields = getEmploymentRelatedFields(EmploymentType.NOTARY, {});

    expect(fields).toEqual(expectedFields);
  });
});

it('should return geely spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.GEELY,
    vehiclePrice: 1_000_000,
    initialPayment: 0,
    creditAmount: 800_000,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.GEELY);
});

it('should return correct initial payment for geely spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.GEELY,
    creditAmount: 1_000_000,
    initialPayment: 100_000,
    vehiclePrice: 1_200_000,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.initialPayment).toBeTruthy();
  expect(creditProgram.initialPayment.min).toEqual(0);
  expect(creditProgram.initialPayment.max).toEqual(900_000);
});

it('should return correct rate for geely spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.GEELY,
    creditAmount: 1_000_000,
    initialPayment: 100_000,
    vehiclePrice: 1_200_000,
    term: 60,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.rate).toBeTruthy();
  expect(creditProgram.rate).toEqual(0.13);
});

it('should return kia spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.KIA,
    vehiclePrice: 1_000_000,
    initialPayment: 0,
    creditAmount: 800_000,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.KIA);
});

it('should return correct initial payment for kia spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.KIA,
    creditAmount: 1_000_000,
    initialPayment: 100_000,
    vehiclePrice: 1_200_000,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.initialPayment).toBeTruthy();
  expect(creditProgram.initialPayment.min).toEqual(params.vehiclePrice * 0.1);
  expect(creditProgram.initialPayment.max).toEqual(params.vehiclePrice - creditProgram.credit.min);
});

it('should return correct rate for kia spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.KIA,
    creditAmount: 1_000_000,
    initialPayment: 120_000,
    vehiclePrice: 1_200_000,
    term: 60,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.rate).toBeTruthy();
  expect(creditProgram.rate).toEqual(0.14);
});

it('should return hyundai spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.HYUNDAI,
    vehiclePrice: 1_000_000,
    initialPayment: 120_000,
    creditAmount: 800_000,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.HYUNDAI);
});

it('should return correct initial payment for hyundai spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.HYUNDAI,
    creditAmount: 1_000_000,
    initialPayment: 120_000,
    vehiclePrice: 1_200_000,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.initialPayment).toBeTruthy();
  expect(creditProgram.initialPayment.min).toEqual(params.vehiclePrice * 0.1);
  expect(creditProgram.initialPayment.max).toEqual(params.vehiclePrice - creditProgram.credit.min);
});

it('should return correct rate for hyundai spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.HYUNDAI,
    creditAmount: 1_000_000,
    initialPayment: 120_000,
    vehiclePrice: 1_200_000,
    term: 60,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.rate).toBeTruthy();
  expect(creditProgram.rate).toEqual(0.14);
});

it('should return captive spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.CAPTIVE,
    vehiclePrice: 1_000_000,
    initialPayment: 0,
    creditAmount: 800_000,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.name).toEqual(CREDIT_PROGRAM_NAME.CAPTIVE);
});

it('should return correct initial payment for captive spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.CAPTIVE,
    creditAmount: 1_000_000,
    initialPayment: 100_000,
    vehiclePrice: 1_200_000,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.initialPayment).toBeTruthy();
  expect(creditProgram.initialPayment.min).toEqual(0);
  expect(creditProgram.initialPayment.max).toEqual(params.vehiclePrice - creditProgram.credit.min);
});

it('should return correct rate for captive spec program', () => {
  const params = {
    programName: CREDIT_PROGRAM_NAME.CAPTIVE,
    creditAmount: 1_000_000,
    initialPayment: 120_000,
    vehiclePrice: 1_200_000,
    term: 60,
  };

  const creditProgram = getCreditProgram(params);

  expect(creditProgram.rate).toBeTruthy();
  expect(creditProgram.rate).toEqual(0.095);
});
