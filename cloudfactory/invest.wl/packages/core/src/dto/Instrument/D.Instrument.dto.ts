import { TModelId } from '../../types';
import { IDCurrencyDTO } from '../Currency/D.Currency.dto';
import { IDImageDefault } from '../Image/D.Image.dto';

export interface IInstrumentIdBase {
  id: TModelId;
  classCode?: string;
  secureCode?: string;
}

export interface IInstrumentIdBaseOther extends Omit<IInstrumentIdBase, 'id'> {
  instrumentId: TModelId;
}

export interface IDInstrumentId extends IInstrumentIdBase {
  readonly isFull: boolean;

  equals(cid?: IInstrumentIdBase): boolean;
  toString(separator?: string): string;
  toJSON(): IInstrumentIdBase;
  toJSON(other: boolean): IInstrumentIdBaseOther;
}

export interface IDInstrumentIdentityPart {
  // id = instrumentId
  id: IDInstrumentId;
  Name: string;
  ClassCode: string;
  SecureCode: string;
  Image: IDImageDefault;
}

export interface IDInstrumentTypePart {
  AssetType: EDInstrumentAssetType;
  AssetSubType: EDInstrumentAssetSubType;
  Currency: IDCurrencyDTO;
}

export interface IDInstrumentInfoPart extends IDInstrumentTypePart {
  IsFavorite: boolean;
  PriceStep: number;
  Change: number;
  ChangePoint: number;
  // Рыночная цена. (!) ВНИМАНИЕ: для Облигаций в некоторых АПИ этот параметр приходит в свойство MidRateMoney, а сам MidRate по сути является MidRatePercent
  MidRate: number;
  MidRatePercent: number;
  YTM?: number;
}

export interface IDInstrumentTradePart {
  Ask: number;
  Bid: number;
  AskMoney: number;
  BidMoney: number;
  PLToMaturity: number;
  // наименование торговой площадки (tradeFloorName)
  Exchange: string;
  // исходная валюта
  PricingCurrency: string;
  // Cопряжённая валюта
  DealingCurrency: string;
  InitialMargin: number;
  AI: number;
  DaysToMaturityOrPut: number;
  Notional: number;
  LotSize: number;
  Updated: Date;
}

export interface IDInstrumentSummaryPart {
  Volume: number;
  HighPrice: number;
  LowPrice: number;
  HighPriceMoney: number;
  LowPriceMoney: number;
  HasPosition: boolean;
  MaturityDate?: Date;
  State: EDInstrumentTradeState;
}

export interface IDInstrumentDTO extends IDInstrumentIdentityPart, IDInstrumentInfoPart {
}

export enum EDInstrumentQuoteType {
  Unknown = 0,
  Feed = 1,
  // Favorite
  User = 2,
  // Акции в портфеле
  Portfel = 3,
  // Валюты
  Currency = 4,
  // Голубые фишки (Акции!)
  BlueChips = 5,
  // Мировые индексы
  WorldIndex = 6,
  // Лидеры роста
  LeadUp = 7,
  // Лидеры падения
  LeadDown = 8,
  // Фьючерсы
  Future = 9,
  // АДР
  ADRGDR = 10,
  // Товарные рынки
  CommodityMarkets = 11,
  // Forex
  Forex = 12,
  // Иностранные акции
  American = 13,
  // Облигации
  RubleBond = 14,
  // ETF (Фонды)
  ETF = 15,
  // Eurobonds
  EuroBond = 16,
  // Crypto
  Crypto = 17,
  // Паи(Пифы)
  Fond = 18,
  // Ноты
  Note = 19,
  // Incomplete eurobonds
  EurobondsIncompleteLots = 20
}

export enum EDInstrumentAssetType {
  UNKNOWN = 0,
  Equity = 1,
  Future = 2,
  Option = 3,
  Bond = 4,
  Index = 5,
  FX = 6,
  Money = 7,
  Deposit = 8,
  PreciousMetal = 9,
  CompositeIndex = 10,
  Loan = 11,
  Structured = 12
}

export enum EDInstrumentAssetSubType {
  UNKNOWN = 0,
  Equity = 1,
  Future = 2,
  Option = 3,
  Bond = 4,
  Index = 5,
  FX = 6,
  Money = 7,
  Deposit = 8,
  PreciousMetal = 9,
  CompositeIndex = 10,
  Loan = 11,
  Structured = 12,
  USMarkets = 101,
  ETF = 102,
  Crypto = 103,
  PIF = 104,
  BondsPIF = 105,
  Eurobonds = 401,
}

export enum EDInstrumentTradeState {
  Stopped = 0,
  Trading = 1,
}

export enum EDInstrumentMarketHistoryMode {
  Duration = 'duration',
  Length = 'length'
}

export enum EDInstrumentMarketHistoryGap {
  Minute1 = '1m',
  Minute5 = '5m',
  Hour1 = '1h',
  Day1 = '1d',
  Week1 = '1w',
}

// {
//  AssetSubType: 4
//  AssetType: 4
//  Change: 0.05957108816521
//  ChangePoint: 0.06
//  ClassCode: "TQCB"
// ▶Currency: {Name}
// ▶Image: {Default}
//  InstrumentId: 49046
//  IsFavorite: true
//  MaturityDate: "2020-06-18T21:00:00.0000000Z"
//  MidRate: 1038.87
//  MidRatePercent: 100.78
//  Name: "РСХБ 01Т1"
//  Perpetual: 1
//  PriceStep: 0.01
//  SecurCode: "RU000A0ZZ4T1"
// ▶SettleCode: {Code, Description}
//  TradeFloorId: 1
//  Updated: "2021-08-24T19:25:21.2870000Z"
//  YTM: 9.03
// }
