import { EDOrderStatus, Injectable } from '@invest.wl/core';
import { IVOrderI18n } from './V.Order.types';

@Injectable()
export class VOrderI18n implements IVOrderI18n {
  public status: { [S in EDOrderStatus]: string } = {
    [EDOrderStatus.Deleting]: 'Ожидает исполнения',
    [EDOrderStatus.Error]: 'Отменена',
    [EDOrderStatus.NotSent]: 'Ожидает исполнения',
    [EDOrderStatus.Deleted]: 'Отменена',
    [EDOrderStatus.New]: 'Ожидает исполнения',
    [EDOrderStatus.Reduced]: 'Исполнена',
    [EDOrderStatus.ReducedPartial]: 'Частично исп.',
  };
}
