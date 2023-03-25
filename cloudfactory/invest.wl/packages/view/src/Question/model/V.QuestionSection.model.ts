import { ILambda, IVModelX, VModelX } from '@invest.wl/common';
import { Injectable, IoC } from '@invest.wl/core';
import { IDQuestionSectionModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVQuestionI18n, VQuestionI18nTid } from '../V.Question.types';

export const VQuestionSectionModelTid = Symbol.for('VQuestionSectionModelTid');

export interface IVQuestionSectionModel extends IVModelX<IDQuestionSectionModel> {
  readonly title: string;
  readonly name: string;
}

@Injectable()
export class VQuestionSectionModel extends VModelX<IDQuestionSectionModel> implements IVQuestionSectionModel {
  private _i18n = IoC.get<IVQuestionI18n>(VQuestionI18nTid);

  @computed
  public get title() {
    return this._i18n.section[this.domain.dto.code];
  }

  @computed
  public get name() {
    return this.domain.dto.name;
  }

  constructor(dtoLV: ILambda<IDQuestionSectionModel>) {
    super(dtoLV);
    makeObservable(this);
  }
}
