import { IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDPortfelSummaryModel } from '@invest.wl/domain';

export const VPortfelSummaryModelTid = Symbol.for('VPortfelSummaryModelTid');

export interface IVPortfelSummaryModel extends IVModelX<IDPortfelSummaryModel> {
}

@Injectable()
export class VPortfelSummaryModel extends VModelX<IDPortfelSummaryModel> implements IVPortfelSummaryModel {

}
