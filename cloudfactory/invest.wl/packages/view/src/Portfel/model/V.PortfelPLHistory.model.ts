import { IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDPortfelPLHistoryModel } from '@invest.wl/domain';

export const VPortfelPLHistoryModelTid = Symbol.for('VPortfelPLHistoryModelTid');

export interface IVPortfelPLHistoryModel extends IVModelX<IDPortfelPLHistoryModel> {
}

@Injectable()
export class VPortfelPLHistoryModel extends VModelX<IDPortfelPLHistoryModel> implements IVPortfelPLHistoryModel {

}
