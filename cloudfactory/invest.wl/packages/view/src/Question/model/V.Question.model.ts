import { ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { IDQuestionOptionDTO, Injectable } from '@invest.wl/core';
import { IDQuestionModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';

export const VQuestionModelTid = Symbol.for('VQuestionModelTid');

export interface IVQuestionModel extends IVModelX<IDQuestionModel> {
  readonly name?: string;
  readonly text?: string;
  readonly answer?: string;
  readonly description?: string;
  readonly optionList?: IDQuestionOptionDTO[];
}

@Injectable()
export class VQuestionModel extends VModelX<IDQuestionModel> implements IVQuestionModel {
  @computed
  public get name() {
    return this.domain.dto.name;
  }

  @computed
  public get text() {
    return this.domain.dto.text;
  }

  @computed
  public get answer() {
    return this.domain.answer?.toString();
  }

  @computed
  public get description() {
    return this.domain.dto.description;
  }

  @computed
  public get optionList(): IDQuestionOptionDTO[] | undefined {
    if (!this.domain.optionList) return;
    if (this.domain.isDisplayRadio) return this.domain.optionList.map(o => ({ ...o, text: o.value ? 'Да' : 'Нет' }));
    else return this.domain.optionList;
  }

  constructor(dtoLV: ILambda<IDQuestionModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
