import { EDInstrumentAssetSubType } from '@invest.wl/core';
import { EVInstrumentScreen } from '../Instrument/V.Instrument.types';

export class VPortfelConfig {
  public static asset2nav: { [T in EDInstrumentAssetSubType]?: EVInstrumentScreen } = {
    [EDInstrumentAssetSubType.Bond]: EVInstrumentScreen.InstrumentQuoteBond,
    [EDInstrumentAssetSubType.Equity]: EVInstrumentScreen.InstrumentQuoteStock,
    [EDInstrumentAssetSubType.FX]: EVInstrumentScreen.InstrumentQuoteFund,
    [EDInstrumentAssetSubType.ETF]: EVInstrumentScreen.InstrumentQuoteFund,
    [EDInstrumentAssetSubType.Future]: EVInstrumentScreen.InstrumentQuoteFutures,
    [EDInstrumentAssetSubType.Option]: EVInstrumentScreen.InstrumentQuoteIndex,
    [EDInstrumentAssetSubType.Money]: EVInstrumentScreen.InstrumentQuoteCurrency,
  };
}
