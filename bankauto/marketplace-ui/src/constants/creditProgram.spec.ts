import { VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { GET_CREDIT_PROGRAM } from './creditProgram';

jest.mock('@marketplace/ui-kit/types', () => ({
  VEHICLE_TYPE: {
    NEW: 'new',
    USED: 'used',
  },
}));

describe('creditProgram', () => {
  it('should return rgsb_pledge_true for new cars', () => {
    const creditProgram = GET_CREDIT_PROGRAM({ price: 2000000, type: VEHICLE_TYPE.NEW, productionYear: 2020 });

    expect(creditProgram.PRODUCT_TYPE).toEqual('rgsb_pledge_true');
  });

  it('should return rgsb_pledge_true_every_ts for used cars with price less than 1kk', () => {
    const creditProgram = GET_CREDIT_PROGRAM({ price: 900000, type: VEHICLE_TYPE.USED, productionYear: 2018 });

    expect(creditProgram.PRODUCT_TYPE).toEqual('rgsb_pledge_true_every_ts');
  });

  it('should return rgsb_pledge_true for used cars with price more than 1kk', () => {
    const creditProgram = GET_CREDIT_PROGRAM({ price: 1200000, type: VEHICLE_TYPE.USED, productionYear: 2018 });

    expect(creditProgram.PRODUCT_TYPE).toEqual('rgsb_pledge_true');
  });

  it('should return rgsb_pledge_true_every_ts for used cars', () => {
    const creditProgram = GET_CREDIT_PROGRAM({ price: 300000, type: VEHICLE_TYPE.USED, productionYear: 2006 });

    expect(creditProgram.PRODUCT_TYPE).toEqual('rgsb_pledge_true_every_ts');
  });

  it('should return rgs_pledge_true_c2c for c2c cars', () => {
    const creditProgram = GET_CREDIT_PROGRAM({
      price: 300000,
      type: VEHICLE_TYPE.USED,
      productionYear: 2012,
      isC2c: true,
    });

    expect(creditProgram.PRODUCT_TYPE).toEqual('rgsb_pledge_true_c2c');
  });

  it('should correctly choose percent for c2c cheap vehicle', () => {
    const creditProgram = GET_CREDIT_PROGRAM({
      price: 300000,
      type: VEHICLE_TYPE.USED,
      productionYear: 2012,
      isC2c: true,
    });

    expect(creditProgram.CREDIT_PERCENT).toEqual(0.099);
  });

  it('should correctly choose percent for c2c expensive vehicle', () => {
    const creditProgram = GET_CREDIT_PROGRAM({
      price: 1_500_001,
      type: VEHICLE_TYPE.USED,
      productionYear: 2012,
      isC2c: true,
    });

    expect(creditProgram.CREDIT_PERCENT).toEqual(0.089);
  });

  it('should correctly calculate monthly payment for c2c with cheap vehicle', () => {
    const creditProgram = GET_CREDIT_PROGRAM({
      price: 300000,
      type: VEHICLE_TYPE.USED,
      productionYear: 2012,
      isC2c: true,
    });

    const monthlyPayment = creditProgram.CREDIT_PER_MONTH(60, 0);

    expect(monthlyPayment).toEqual(7327);
  });

  it('should correctly calculate monthly payment for c2c with expensive vehicle', () => {
    const creditProgram = GET_CREDIT_PROGRAM({
      price: 2_500_000,
      type: VEHICLE_TYPE.USED,
      productionYear: 2019,
      isC2c: true,
    });

    const monthlyPayment = creditProgram.CREDIT_PER_MONTH(60, 0);

    expect(monthlyPayment).toEqual(59649);
  });
});
