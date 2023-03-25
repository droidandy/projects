export enum EDOrderType {
  All = -1,
  Unknown = 0,
  // Лимитная
  LMT = 1,
  // Рыночная
  Market = 2,
  // Stop loose
  STP = 3,
  // Take profit
  TPT = 4,
  // Stop loose / take profit
  TPTSL = 7,
  Negotiated = 8,
  StopPriceByAnotherInstrument = 9,
}

export enum EDOrderSource {
  Strategy = 1,
  Placement = 3,
}

export enum EDOrderStatus {
  Deleting = -3,
  Error = -2,
  NotSent = -1,
  Deleted = 0,
  New = 1,
  Reduced = 2,
  ReducedPartial = 3,
}

export enum EDOrderCreateCan {
  OK,
  Cant,
  ErrorSessionClosed,
  ErrorNoAccount,
  ErrorDisabledForProduct,
  ErrorDisabled,
  ErrorDisabledForAccount,
  IsOTC,
  ErrorDisabledNoAccount ,
  ErrorNotAvailable,
  ErrorInstrumentNotAvailable,
  NotAllowedToBuy,
}
