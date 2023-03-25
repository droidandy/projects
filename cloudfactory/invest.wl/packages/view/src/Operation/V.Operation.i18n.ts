import { EDOperationType, Injectable } from '@invest.wl/core';

@Injectable()
export class VOperationI18n {
  public static type: {[T in EDOperationType]?: string} = {
    [EDOperationType.Payment]: 'Зачисление денежных средств',
    [EDOperationType.Withdrawal]: 'Списание денежных средств',
    [EDOperationType.OtherTaxes]: 'Прочие комиссии',
    [EDOperationType.Dividends]: 'Дивиденды',
    [EDOperationType.NDFL]: 'НДФЛ',
    [EDOperationType.ExchangeCommission]: 'Биржевая комиссия',
    [EDOperationType.BrokerCommission]: 'Брокерская комиссия',
    [EDOperationType.OtherIncome]: 'Прочий доход',
    [EDOperationType.DividendIncome]: 'Зачисление дивидендов',
    [EDOperationType.DividendOutcome]: 'Выплаты по купонам',
  };
}
