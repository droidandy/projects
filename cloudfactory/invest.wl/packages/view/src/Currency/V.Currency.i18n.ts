import { EDCurrencyCode, Injectable } from '@invest.wl/core';
import { IVCurrencyI18n } from './V.Currency.types';

@Injectable()
export class VCurrencyI18n implements IVCurrencyI18n {
  public name = {
    [EDCurrencyCode.RUB]: { one: 'рубль', lt5: 'рубля', gt5: 'рублей', many: 'рубли' },
    [EDCurrencyCode.RUR]: { one: 'рубль', lt5: 'рубля', gt5: 'рублей', many: 'рубли' },
    [EDCurrencyCode.USD]: { one: 'доллар', lt5: 'доллара', gt5: 'долларов', many: 'доллары' },
    [EDCurrencyCode.EUR]: { one: 'евро', lt5: 'евро', gt5: 'евро', many: 'евро' },
    [EDCurrencyCode.GBP]: {
      one: 'фунт стерлинга', lt5: 'фунта стерлинга', gt5: 'фунтов стерлинга', many: 'фунты стерлинги',
    },
    [EDCurrencyCode.CHF]: {
      one: 'швейцарский франк', lt5: 'швейцарских франка', gt5: 'швейцарских франков', many: 'швейцарские франки',
    },
    [EDCurrencyCode.CNY]: { one: 'китайский юань', lt5: 'китайских юаня', gt5: 'китайских юаней', many: 'китайские юани' },
  };
}
