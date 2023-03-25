import { IErrorDTO } from '@invest.wl/core';
import { computed, makeObservable, observable } from 'mobx';
import { ILambda } from '../../reactive/LambdaX';
import { DModelX } from '../../reactive/ModelX/D.ModelX.model';
import { IErrorModel } from './Error.types';

export class ErrorModel<DTO extends IErrorDTO = IErrorDTO> extends DModelX.Value<DTO> implements IErrorModel<DTO> {
  public get isNotified(): boolean {
    return this._isNotified;
  }

  public set isNotified(value: boolean) {
    this._isNotified = value;
  }

  @observable protected _message?: string;

  @computed
  public get message(): string {
    return this._message || this.dto.message || 'Непредвиденная ошибка';
  }

  public set message(value: string) {
    this._message = value;
  }

  protected _isNotified = false;

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }

  public toJSON() {
    return {
      message: this.message,
      fn: this.dto.fn,
      stack: this.dto.stack,
      code: this.dto.code,
    };
  }

  public toError() {
    const err = new Error(this.message);
    err.stack = this.dto.stack;
    return err;
  }
}
