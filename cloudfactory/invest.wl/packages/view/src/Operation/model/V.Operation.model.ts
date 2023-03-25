import { IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDOperationModel } from '@invest.wl/domain';

export const VOperationModelTid = Symbol.for('VOperationModelTid');

export interface IVOperationModel extends IVModelX<IDOperationModel> {
}

@Injectable()
export class VOperationModel extends VModelX<IDOperationModel> {

}
