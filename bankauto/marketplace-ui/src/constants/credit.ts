export enum PRODUCT_TYPE {
  RGSB_PLEDGE_TRUE = 'rgsb_pledge_true',
  RGSB_PLEDGE_TRUE_EVERY_TS = 'rgsb_pledge_true_every_ts',
  RGSB_PLEDGE_TRUE_C2C = 'rgsb_pledge_true_c2c',
}

export enum PRODUCT_TYPE_FIS {
  PLEDGE_TRUE = 'cr_pledge_true',
  PLEDGE_TRUE_ANY = 'cr_pledge_true_any_ts',
  PLEDGE_TRUE_C2C = 'cr_pledge_true_c2c',
}

export enum PRODUCT_SUBTYPE_FIS {
  PLEDGE_TRUE = 'b_pledge_true',
  PLEDGE_TRUE_ANY = 'b_pledge_true_any_ts',
  PROMO_INSTALLMENT = 'p_installment_mp',
  PROMO_CAPTIVE = 'p_captive',
  PROMO_KIA_HYUNDAI = 'p_kia_hyundai',
  PROMO_GEELY = 'p_geely',
}

export enum CREDIT_PROGRAM_NAME {
  /** Автокредит (Новые) */
  VEHICLE_NEW,
  /** Автокредит (Автомобили с пробегом - АСП) */
  VEHICLE_USED,
  /** Залоговый кредит на любое ТС (Кредит на авто с залогом) */
  VEHICLE_PLEDGE_EVERY,
  /** Кредит С2С */
  C2C,
  /** Промо Рассрочка Маркетплейс */
  PROMO_INSTALMENT,
  /** Гибридный кредит */
  HYBRID,
  GEELY,
  KIA,
  HYUNDAI,
  CAPTIVE,
}

export const CREDIT_INFO = {
  minVehicleNewPrice: 330_000,
  minVehicleUsedPrice: 100_000,
  maxVehiclePrice: 15_000_000,

  minStandaloneAmount: 50_000,
  maxStandaloneAmount: 3_000_000,
  defaultStandaloneAmount: 1_000_000,
  maxStandaloneWithVehicleAmount: 15_000_000,
  newVehicleMinAmount: 300_000,
  newVehicleMaxAmount: 7_000_000,
  usedVehicleMinAmount: 300_000,
  usedVehicleMaxAmount: 4_000_000,
  oldVehicleMinAmount: 100_000,
  oldVehicleMaxAmount: 1_000_000,
  standaloneMinTerm: 13,
  standaloneMaxTerm: 60,
  c2cVehicleMinAmount: 100_000,
  c2cVehicleMaxAmount: 3_000_000,

  newVehicleMinTerm: 12,
  newVehicleMaxTerm: 64,
  usedVehicleMinTerm: 12,
  usedVehicleMaxTerm: 60,
  c2cVehicleMinTerm: 13,
  c2cVehicleMaxTerm: 60,

  newVehicleRate: 0.079,
  usedVehicleRate: 0.059,
  oldVehicleRate: 0.049,
  standaloneRate: 0.079,
  standaloneWithVehicleRate: 0.39,
  c2cVehicleRate: 0.059,
};

export enum AdditionalDocumentType {
  DRIVERS_LICENSE = '1',
  INTERNATIONAL_PASSPORT = '2',
  SERVICE_IDENTITY = '3',
  MILITARY_ID = '4',
  SNILS = '5',
}

export const CREDIT_INCREASING_PERCENT = 1.1;

export const MONTHS_RANGE = {
  min: 12,
  max: 60,
};

export const CREDIT_SOURCE = 'bankauto';
