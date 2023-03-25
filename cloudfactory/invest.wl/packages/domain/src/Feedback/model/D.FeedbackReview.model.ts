import { DModelXValue, IDModelXValue } from '@invest.wl/common';
import { IDFeedbackReviewResponseDTO, Injectable } from '@invest.wl/core';

export const DFeedbackReviewModelTid = Symbol.for('DFeedbackReviewModelTid');
type TDTO = IDFeedbackReviewResponseDTO;

export interface IDFeedbackReviewModel<DTO extends TDTO = TDTO> extends IDModelXValue<DTO> {
}

@Injectable()
export class DFeedbackReviewModel<DTO extends TDTO = TDTO> extends DModelXValue<DTO> implements IDFeedbackReviewModel<DTO> {

}
