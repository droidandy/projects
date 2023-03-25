import { IVModelXValue, VModelXValue } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDCustomerPreferenceMapModel } from '@invest.wl/domain';

export const VCustomerPreferenceMapModelTid = Symbol.for('VCustomerPreferenceMapModelTid');

export interface IVCustomerPreferenceMapModel extends IVModelXValue<IDCustomerPreferenceMapModel> {
}

@Injectable()
export class VCustomerPreferenceMapModel extends VModelXValue<IDCustomerPreferenceMapModel> implements IVCustomerPreferenceMapModel {
}
