import { IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDPortfelMVHistoryModel } from '@invest.wl/domain';

export const VPortfelMVHistoryModelTid = Symbol.for('VPortfelMVHistoryModelTid');

export interface IVPortfelMVHistoryModel extends IVModelX<IDPortfelMVHistoryModel> {
}

@Injectable()
export class VPortfelMVHistoryModel extends VModelX<IDPortfelMVHistoryModel> implements IVPortfelMVHistoryModel {

}
