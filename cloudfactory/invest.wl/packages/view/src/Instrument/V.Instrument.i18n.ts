import { II18nMap } from '@invest.wl/common';
import { EDInstrumentAssetSubType, EDInstrumentAssetType, Injectable } from '@invest.wl/core';
import { IVInstrumentI18n } from './V.Instrument.types';

@Injectable()
export class VInstrumentI18n implements IVInstrumentI18n {
  public assetType: { [T in EDInstrumentAssetSubType]: II18nMap } = {
    [EDInstrumentAssetType.UNKNOWN]: {
      one: 'инструмент', lt5: 'инструмента', gt5: 'инструментов', many: 'инструменты',
    },
    [EDInstrumentAssetType.Equity]: { one: 'акция', lt5: 'акции', gt5: 'акций', many: 'акции' },
    [EDInstrumentAssetType.Future]: { one: 'фьючерс', lt5: 'фьючерса', gt5: 'фьючерсов', many: 'фьючерсы' },
    [EDInstrumentAssetType.Option]: { one: 'опцион', lt5: 'опциона', gt5: 'опционов', many: 'опционы' },
    [EDInstrumentAssetType.Bond]: { one: 'облигация', lt5: 'облигации', gt5: 'облигаций', many: 'облигации' },
    [EDInstrumentAssetType.Index]: { one: 'индекс', lt5: 'индекса', gt5: 'индексов', many: 'индексы' },
    [EDInstrumentAssetType.FX]: { one: 'валюта', lt5: 'валюты', gt5: 'валют', many: 'валюты' },
    [EDInstrumentAssetType.Money]: {
      one: 'денежные средство', lt5: 'денежных средства', gt5: 'денежных средств', many: 'денежные средства',
    },
    [EDInstrumentAssetSubType.Deposit]: { one: 'вклад', lt5: 'вклада', gt5: 'вкладов', many: 'вклады' },
    [EDInstrumentAssetSubType.PreciousMetal]: {
      one: 'драгметалл', lt5: 'драгметалла', gt5: 'драгметаллов', many: 'драгметаллы',
    },
    [EDInstrumentAssetSubType.CompositeIndex]: { one: 'индекс', lt5: 'индекса', gt5: 'индексов', many: 'индексы' },
    [EDInstrumentAssetSubType.Loan]: { one: 'долг', lt5: 'долга', gt5: 'долгов', many: 'долги' },
    [EDInstrumentAssetSubType.Structured]: { one: 'структура', lt5: 'структуры', gt5: 'структур', many: 'структуры' },
    [EDInstrumentAssetSubType.USMarkets]: { one: 'рынок', lt5: 'рынока', gt5: 'рыноков', many: 'рыноки' },
    [EDInstrumentAssetSubType.ETF]: { one: 'фонд', lt5: 'фонда', gt5: 'фондов', many: 'фонды' },
    [EDInstrumentAssetSubType.Crypto]: { one: 'крипта', lt5: 'крипты', gt5: 'крипт', many: 'крипты' },
    [EDInstrumentAssetSubType.PIF]: { one: 'ПИФ', lt5: 'ПИФа', gt5: 'ПИФов', many: 'ПИФы' },
    [EDInstrumentAssetSubType.BondsPIF]: { one: 'ПИФ', lt5: 'ПИФа', gt5: 'ПИФов', many: 'ПИФы' },
    [EDInstrumentAssetSubType.Eurobonds]: {
      one: 'евро-облигация', lt5: 'евро-облигации', gt5: 'евро-облигаций', many: 'евро-облигации',
    },
  };

  public assetTypeGenitive: { [T in EDInstrumentAssetSubType]: II18nMap } = {
    [EDInstrumentAssetType.UNKNOWN]: {
      one: 'инструмента', lt5: 'инструментов', gt5: 'инструментов', many: 'инструментов',
    },
    [EDInstrumentAssetType.Equity]: { one: 'акции', lt5: 'акций', gt5: 'акций', many: 'акций' },
    [EDInstrumentAssetType.Future]: { one: 'фьючерса', lt5: 'фьючерсов', gt5: 'фьючерсов', many: 'фьючерсов' },
    [EDInstrumentAssetType.Option]: { one: 'опциона', lt5: 'опционов', gt5: 'опционов', many: 'опционов' },
    [EDInstrumentAssetType.Bond]: { one: 'облигации', lt5: 'облигаций', gt5: 'облигаций', many: 'облигаций' },
    [EDInstrumentAssetType.Index]: { one: 'индекса', lt5: 'индексов', gt5: 'индексов', many: 'индексов' },
    [EDInstrumentAssetType.FX]: { one: 'валюты', lt5: 'валют', gt5: 'валют', many: 'валют' },
    [EDInstrumentAssetType.Money]: {
      one: 'денежного средства', lt5: 'денежных средств', gt5: 'денежных средств', many: 'денежные средств',
    },
    [EDInstrumentAssetSubType.Deposit]: { one: 'вклада', lt5: 'вкладов', gt5: 'вкладов', many: 'вкладов' },
    [EDInstrumentAssetSubType.PreciousMetal]: {
      one: 'драгметалла', lt5: 'драгметаллов', gt5: 'драгметаллов', many: 'драгметаллов',
    },
    [EDInstrumentAssetSubType.CompositeIndex]: { one: 'индекса', lt5: 'индексов', gt5: 'индексов', many: 'индексов' },
    [EDInstrumentAssetSubType.Loan]: { one: 'долга', lt5: 'долгов', gt5: 'долгов', many: 'долгов' },
    [EDInstrumentAssetSubType.Structured]: { one: 'структуры', lt5: 'структур', gt5: 'структур', many: 'структур' },
    [EDInstrumentAssetSubType.USMarkets]: { one: 'рынка', lt5: 'рынков', gt5: 'рынков', many: 'рынков' },
    [EDInstrumentAssetSubType.ETF]: { one: 'фондового пая', lt5: 'паёв фонда', gt5: 'паёв фонда', many: 'паёв фонда' },
    [EDInstrumentAssetSubType.Crypto]: { one: 'крипты', lt5: 'крипт', gt5: 'крипт', many: 'крипт' },
    [EDInstrumentAssetSubType.PIF]: { one: 'фондового пая', lt5: 'паёв фонда', gt5: 'паёв фонда', many: 'паёв фонда' },
    [EDInstrumentAssetSubType.BondsPIF]: { one: 'фондового пая', lt5: 'паёв фонда', gt5: 'паёв фонда', many: 'паёв фонда' },
    [EDInstrumentAssetSubType.Eurobonds]: {
      one: 'евро-облигации', lt5: 'евро-облигаций', gt5: 'евро-облигаций', many: 'евро-облигаций',
    },
  };
}
