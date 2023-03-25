import { TModelId } from '../../types';

// на самом деле это тип договора к которому счет пренадлежит. в договоре присутствует признаки IIS \ DU
export enum EDAccountAgreementType {
  Default = 'Основной',
  IIS = 'ИИС',
  DU = 'ДУ',
  PIF = 'ПИФ',
}

export enum EDAccountMarketType {
  Fund = 'Фондовый',
  Term = 'Срочный',
  Currency = 'Валютный',
  FundSPB = 'Фондовый СПб',
  OTC = 'Внебиржевой',
}

// почти тоже самое что и EDAccountMarketType, только другие значения
// when pl.AccType='forts' or ct.Name like 'SPBFUT%' then 'Срочный'
// when pl.AccType='OTC' or pl.AccType = 'ExchangeOTC' or ct.Name like '%Внебирж%' then 'Внебиржевой'
// when pl.AccType='cur' then 'Валютный'
// when pl.AccType='spb' then 'Фондовый СПб'
// when pl.AccType='dma' then 'DMA' else 'Фондовый'
export enum EDAccountBoard {
  Other = 'other',
  Term = 'forts',
  Currency = 'cur',
  FundSPB = 'spb',
  OTC = 'OTC',
}

export interface IDAccountFreeMoneyDTO {
  RUR: number;
  EUR: number;
  USD: number;
}

export interface IDAccountIdentityPart {
  id: TModelId;
  Name: string;
  DisplayName: string;
}

export interface IDAccountTypePart {
  AgreementType: EDAccountAgreementType;
  Board: EDAccountBoard;
  // почти тоже самое что и Board но приходит из других АПИ (в частности plByInstrument)
  MarketType?: EDAccountMarketType;
}

export interface IDAccountDTO extends IDAccountIdentityPart, IDAccountTypePart {
  // id = accountId;
  IsStrategy: boolean;
  IsTradingAccount: boolean;
  TradeAccountMapId: TModelId;
  MarketValue: number;
  FreeCash: number;
  FreeInstrumentAmount: number;
  FreeCashInstrumentCurrency: number;
  FreeMoney: IDAccountFreeMoneyDTO;
  // TODO: ask enum?
  CanOrderSP: number;
  // TODO: ask in Client?
  ClientCode: string;
}
