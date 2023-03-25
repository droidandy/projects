import { IDInputModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

// ViewModel для ввода номера паспорта

export class VInputPassportNumModel extends VInputModel {
  public static mask = '[000000]';

  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, props);
    makeObservable(this);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput?.replace(/\D/g, ''));
  }

  @computed
  public get maskOptions() {
    return { mask: VInputPassportNumModel.mask };
  }
}
