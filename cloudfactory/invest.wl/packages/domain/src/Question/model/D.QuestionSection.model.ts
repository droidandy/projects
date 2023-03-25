import { DModelX, IDModelX, ILambda } from '@invest.wl/common';
import { IDQuestionSectionDTO, Injectable, TDQuestionSection } from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';

export const DQuestionSectionModelTid = Symbol.for('DQuestionSectionModelTid');
type TDTO = IDQuestionSectionDTO;

export interface IDQuestionSectionModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly questionCount: number;
  readonly sectionsRequest: TDQuestionSection[];
}

@Injectable()
export class DQuestionSectionModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDQuestionSectionModel<DTO> {
  constructor(props: ILambda<DTO>) {
    super(props);
    makeObservable(this);
  }

  @computed
  public get questionCount() {
    return this.dto.questionCount || 0;
  }

  @computed
  public get sectionsRequest(): TDQuestionSection[] {
    return [this.dto.code];
    // return this.dto.code !== 'qualifiedInvestor_1' ? [this.dto.code] : ['qualifiedInvestor_1', 'qualifiedInvestor_2'];
  }
}
