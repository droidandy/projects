import { IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDStoryModel } from '@invest.wl/domain';

export const VStoryModelTid = Symbol.for('VStoryModelTid');

export interface IVStoryModel extends IVModelX<IDStoryModel> {
}

@Injectable()
export class VStoryModel extends VModelX<IDStoryModel> implements IVStoryModel {

}
