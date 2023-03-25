import { IVModelXValue, VModelXValue } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDInstrumentAlertCountModel } from '@invest.wl/domain';

export const VInstrumentAlertCountModelTid = Symbol.for('VInstrumentAlertCountModelTid');

export interface IVInstrumentAlertCountModel extends IVModelXValue<IDInstrumentAlertCountModel> {
}

@Injectable()
export class VInstrumentAlertCountModel extends VModelXValue<IDInstrumentAlertCountModel> implements IVInstrumentAlertCountModel {

}
