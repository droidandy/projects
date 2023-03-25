import { IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDStoryItemModel } from '@invest.wl/domain';

export const VStoryItemModelTid = Symbol.for('VStoryItemModelTid');

export interface IVStoryItemModel extends IVModelX<IDStoryItemModel> {
}

@Injectable()
export class VStoryItemModel extends VModelX<IDStoryItemModel> implements IVStoryItemModel {

}
