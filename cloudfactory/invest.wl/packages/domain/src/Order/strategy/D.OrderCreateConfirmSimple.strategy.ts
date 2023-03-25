import { Injectable } from '@invest.wl/core';
import { IDOrderCreateConfirmStrategy } from '../D.Order.types';
import { IDOrderCreateModel } from '../model/D.OrderCreate.model';
import { IDOrderCreateConfirmModel } from '../model/D.OrderCreateConfirm.model';

@Injectable()
export class DOrderCreateConfirmSimpleStrategy implements IDOrderCreateConfirmStrategy {
  public async onCreate(model: IDOrderCreateModel) { }

  public async onConfirm(model: IDOrderCreateConfirmModel) { }
}
