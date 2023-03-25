export enum EDOperationType {
  Payment = 1,
  Withdrawal = 2,
  Coupon = 3,
  Dividend = 4,
  OtherTaxes = 5,
  Dividends = 7,
  BetweenAccount = 12,
  RedemptionBond = 10,
  NDFL = 14,
  ExchangeCommission = 15,
  BrokerCommission = 16,
  OtherIncome = 17,
  DividendIncome = -1,
  DividendOutcome = -2,
}

export enum EDOperationStatus {
  Active = 1,
  Executed = 2,
  Canceled = 3
}
