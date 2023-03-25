import { IDInputModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

// ViewModel для ввода серии паспорта

export class VInputPassportSerialModel extends VInputModel {
  public static mask = '[00] [00]';

  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, props);
    makeObservable(this);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput?.replace(/\D/g, ''));
  }

  @computed
  public get maskOptions() {
    return { mask: VInputPassportSerialModel.mask };
  }
}
