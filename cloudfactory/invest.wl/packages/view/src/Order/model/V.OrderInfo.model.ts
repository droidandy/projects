import { IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDOrderInfoModel } from '@invest.wl/domain';

export const VOrderInfoModelTid = Symbol.for('VOrderInfoModelTid');

export interface IVOrderInfoModel extends IVModelX<IDOrderInfoModel> {
}

@Injectable()
export class VOrderInfoModel extends VModelX<IDOrderInfoModel> implements IVOrderInfoModel {

}
