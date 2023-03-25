import { IVModelXValue, VModelXValue } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDNotificationSettingModel } from '@invest.wl/domain';

export const VNotificationSettingModelTid = Symbol.for('VNotificationSettingModelTid');

export interface IVNotificationSettingModel extends IVModelXValue<IDNotificationSettingModel> {
}

@Injectable()
export class VNotificationSettingModel extends VModelXValue<IDNotificationSettingModel> implements IVNotificationSettingModel {

}
