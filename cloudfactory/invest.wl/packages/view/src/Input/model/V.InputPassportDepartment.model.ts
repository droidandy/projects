import { IDInputModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

// ViewModel для ввода код подразделения паспорта

export class VInputPassportDepartmentModel extends VInputModel {
  public static mask = '[000]-[000]';

  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, props);
    makeObservable(this);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput?.replace(/[\D]/g, ''));
  }

  @computed
  public get maskOptions() {
    return { mask: VInputPassportDepartmentModel.mask };
  }
}
