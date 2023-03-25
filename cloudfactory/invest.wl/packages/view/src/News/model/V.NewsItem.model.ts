import { IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDNewsItemModel } from '@invest.wl/domain';

export const VNewsItemModelTid = Symbol.for('VNewsItemModelTid');

export interface IVNewsItemModel extends IVModelX<IDNewsItemModel> {
}

@Injectable()
export class VNewsItemModel extends VModelX<IDNewsItemModel> implements IVNewsItemModel {

}
