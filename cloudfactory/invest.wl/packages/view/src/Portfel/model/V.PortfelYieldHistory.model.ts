import { IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDPortfelYieldHistoryModel } from '@invest.wl/domain';

export const VPortfelYieldHistoryModelTid = Symbol.for('VPortfelYieldHistoryModelTid');

export interface IVPortfelYieldHistoryModel extends IVModelX<IDPortfelYieldHistoryModel> {
}

@Injectable()
export class VPortfelYieldHistoryModel extends VModelX<IDPortfelYieldHistoryModel> implements IVPortfelYieldHistoryModel {

}
