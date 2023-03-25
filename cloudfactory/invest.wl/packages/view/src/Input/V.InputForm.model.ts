import { TModelDTO } from '@invest.wl/common';
import { IDInputFormModel } from '@invest.wl/domain';
import { action, computed, makeObservable } from 'mobx';
import { VInputModel } from './model/V.Input.model';
import { IVInputFormFields, IVInputFormModel } from './V.Input.types';

export abstract class VInputFormModel<M extends IDInputFormModel<any>, DTO extends TModelDTO = M['asDTO']> implements IVInputFormModel<M, DTO> {
  public abstract get fields(): IVInputFormFields<DTO>;

  @computed
  public get isValid() {
    return this.domain.isValid;
  }

  @computed
  public get domain() {
    return this._domain;
  }

  constructor(private _domain: M) {
    makeObservable(this);
  }

  @action
  public reset() {
    this._eachField(this.fields, f => f.reset());
  }

  @action
  public dirtySet(dirty = true) {
    this._eachField(this.fields, f => f.dirtySet(dirty));
  }

  private _eachField(fields: IVInputFormFields<DTO>, fn: (field: VInputModel) => void) {
    Object.values(fields).forEach(f => {
      return f instanceof VInputModel ? fn(f) : Array.isArray(f)
        ? f.forEach(i => i instanceof VInputModel ? fn(i) : this._eachField(i, fn))
        : this._eachField(f, fn);
    });
  }
}
