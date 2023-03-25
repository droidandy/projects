import { IDAccountByAgreementDTO, IDAccountItemDTO, IDAccountQUIKItemDTO } from '@invest.wl/core';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import orderBy from 'lodash/orderBy';

export class DAccountUtil {
  public static groupByAgreement<T extends IDAccountItemDTO | IDAccountQUIKItemDTO>(list?: T[]) {
    if (!list) return [];
    return map(groupBy(list, a => a.Agreement.id), (list, agreementId) => ({
      id: agreementId,
      AccountList: list,
    } as IDAccountByAgreementDTO<T>));
  }

  public static order<T extends IDAccountItemDTO | IDAccountQUIKItemDTO>(list?: T[]) {
    return orderBy<T>(list, [a => a.MarketValue, a => a.Agreement.Agreement, a => a.IsTradingAccount], ['asc', 'asc', 'desc']);
  }
}
