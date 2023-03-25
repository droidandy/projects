import { IVModelX, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDBankAccountModel } from '@invest.wl/domain';

export const VBankAccountModelTid = Symbol.for('VBankAccountModelTid');

export interface IVBankAccountModel extends IVModelX<IDBankAccountModel> {
}

@Injectable()
export class VBankAccountModel extends VModelX<IDBankAccountModel> implements IVBankAccountModel {
}
