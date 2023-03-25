import { IVModelXValue, VModelX } from '@invest.wl/common';
import { Injectable } from '@invest.wl/core';
import { IDFeedbackReviewModel } from '@invest.wl/domain';

export const VFeedbackReviewModelTid = Symbol.for('VFeedbackReviewModelTid');

export interface IVFeedbackReviewModel extends IVModelXValue<IDFeedbackReviewModel> {
}

@Injectable()
export class VFeedbackReviewModel extends VModelX.Value<IDFeedbackReviewModel> {

}
