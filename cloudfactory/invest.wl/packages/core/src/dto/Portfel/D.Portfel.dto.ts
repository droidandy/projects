export enum EDPortfelTradingState {
  Cant = 0,
  Can = 1,
  DisabledForProduct = 2,
  Disabled = 3,
  DisabledForAccount = 4,
  DisabledNoAccount = 5,
  NotAvailable = 6,
  Excluded = 7,
  IsOTC = 8,
  NotAllowedToBuy = 9,
}

export enum EDPortfelHistoryType {
  Ctpt = 0,
  Book = 1,
  Ctptgroup = 2,
  Traders = 3
}

export enum EDPortfelOperationType {
  // торговые операции
  Trade = 1,
  // задолженности
  Debts = 2,
  // задолженности
  Debts2 = 3,
  UNKNOWN4 = 4,
  UNKNOWN5 = 5,
  UNKNOWN6 = 6,
}

export enum EDPortfelGroup {
  All = 'All',
  AgreementId = 'AgreementId',
  AccountId = 'AccountId',
  AccountMarketType = 'AccountMarketType',
  TradeMarket = 'TradeMarket',
  InstrumentAssetType = 'InstrumentAssetType',
  InstrumentId = 'InstrumentId',
}
