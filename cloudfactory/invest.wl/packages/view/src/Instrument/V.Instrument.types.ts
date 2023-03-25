import { II18nMap } from '@invest.wl/common';
import { EDInstrumentAssetSubType } from '@invest.wl/core';
import { IDInstrumentQuoteListCaseProps } from '@invest.wl/domain';
import { IVInstrumentPresentProps } from './present/V.Instrument.present';
import { IVInstrumentExchangePresentProps } from './present/V.InstrumentExchange.present';
import { IVInstrumentSearchPresentProps } from './present/V.InstrumentSearch.present';

export const VInstrumentI18nTid = Symbol.for('VInstrumentI18nTid');
export const VInstrumentQuoteListPresentTid = Symbol.for('VInstrumentQuoteListPresentTid');

export interface IVInstrumentI18n {
  assetType: { [T in EDInstrumentAssetSubType]: II18nMap };
  assetTypeGenitive: { [T in EDInstrumentAssetSubType]: II18nMap };
}

export enum EVInstrumentScreen {
  Instrument = 'Instrument',
  InstrumentExchange = 'InstrumentExchange',
  InstrumentSearch = 'InstrumentSearch',
  InstrumentQuoteFavorite = 'InstrumentQuoteFavorite',
  InstrumentQuoteStock = 'InstrumentQuoteStock',
  InstrumentQuoteBond = 'InstrumentQuoteBond',
  InstrumentQuoteFund = 'InstrumentQuoteFund',
  InstrumentQuoteFutures = 'InstrumentQuoteFutures',
  InstrumentQuoteCurrency = 'InstrumentQuoteCurrency',
  InstrumentQuotePlacement = 'InstrumentQuotePlacement',
  InstrumentQuoteIndex = 'InstrumentQuoteIndex',
}

export interface IVInstrumentScreenParams {
  Instrument: IVInstrumentPresentProps;
  InstrumentExchange: IVInstrumentExchangePresentProps;
  InstrumentSearch: IVInstrumentSearchPresentProps;
  InstrumentQuoteFavorite: IVInstrumentQuoteListPresentProps;
  InstrumentQuoteStock: IVInstrumentQuoteListPresentProps;
  InstrumentQuoteBond: IVInstrumentQuoteListPresentProps;
  InstrumentQuoteFund: IVInstrumentQuoteListPresentProps;
  InstrumentQuoteFutures: IVInstrumentQuoteListPresentProps;
  InstrumentQuoteCurrency: IVInstrumentQuoteListPresentProps;
  InstrumentQuotePlacement: IVInstrumentQuoteListPresentProps;
  InstrumentQuoteIndex: IVInstrumentQuoteListPresentProps;
}

export interface IVInstrumentQuoteListPresentProps extends IDInstrumentQuoteListCaseProps {
}
