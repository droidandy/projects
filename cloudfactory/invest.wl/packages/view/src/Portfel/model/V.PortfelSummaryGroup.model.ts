import { IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDPortfelSummaryGroupModel } from '@invest.wl/domain';

export const VPortfelSummaryGroupModelTid = Symbol.for('VPortfelSummaryGroupModelTid');

export interface IVPortfelSummaryGroupModel extends IVModelX<IDPortfelSummaryGroupModel> {
}

@Injectable()
export class VPortfelSummaryGroupModel extends VModelX<IDPortfelSummaryGroupModel> implements IVPortfelSummaryGroupModel {

}
