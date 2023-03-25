import { DModelX, IDModelX, ILambda } from '@invest.wl/common';
import {
  EDQuestionDisplayType,
  IDFileDTO,
  IDQuestionAnswerSaveDTO,
  IDQuestionDTO,
  IDQuestionOptionDTO,
  Injectable,
  TDQuestionAnswerValue,
} from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';

export const DQuestionModelTid = Symbol.for('DQuestionModelTid');
type TDTO = IDQuestionDTO;

export interface IDQuestionModel<DTO extends TDTO = TDTO> extends IDModelX<DTO> {
  readonly answer?: TDQuestionAnswerValue;
  answerFile?: IDFileDTO;
  readonly isValid: boolean;
  readonly isTrue: boolean;
  readonly isDisplayRadio: boolean;
  readonly isFile: boolean;
  readonly optionList?: (Pick<IDQuestionOptionDTO, 'value'>)[];
  asAnswer(): IDQuestionAnswerSaveDTO | undefined;
  answerSet(value: TDQuestionAnswerValue): void;
}

@Injectable()
export class DQuestionModel<DTO extends TDTO = TDTO> extends DModelX<DTO> implements IDQuestionModel<DTO> {
  @observable private _answer?: TDQuestionAnswerValue;
  @computed
  public get answer(): TDQuestionAnswerValue | undefined {
    return this.isFile ? this.answerFile?.name : this._answer ?? this.dto.answer?.value;
  }

  @observable public answerFile?: IDFileDTO;

  @computed
  public get isValid() {
    return this.dto.required ? this.answer != null && (this.isDisplayRadio ? true : this.answer !== false) : true;
  }

  @computed
  public get isTrue() {
    return this.answer != null && this.answer !== '0' && this.answer !== 'false';
  }

  @computed
  public get isDisplayRadio() {
    return this.dto.displayType === EDQuestionDisplayType.Radio;
  }

  @computed
  public get isFile() {
    return this.dto.displayType === EDQuestionDisplayType.File;
  }

  @computed
  public get optionList(): (Pick<IDQuestionOptionDTO, 'value'>)[] | undefined {
    if (this.dto.optionList?.length) return this.dto.optionList;
    if (this.isDisplayRadio) return [{ value: true }, { value: false }];
    return;
  }

  constructor(props: ILambda<DTO>) {
    super(props);
    makeObservable(this);
  }

  public asAnswer(): IDQuestionAnswerSaveDTO | undefined {
    if (!this.isValid) throw new Error('Ответ на вопрос не валидный');
    return this.answer ? { value: this.answer, questionId: this.dto.id } : undefined;
  }

  @action.bound
  public answerSet(value: TDQuestionAnswerValue | undefined) {
    this._answer = value;
  }
}
