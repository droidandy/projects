import { IDInputModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

// ViewModel для ввода Паспорта (серия и номер)
export class VInputPassportModel extends VInputModel<IDInputModel<[string, string]>> {
  public static mask = '[0000] [000000]';

  constructor(model: IDInputModel<[string, string]>, props?: IVInputModelProps) {
    super(model, { pattern: '[^0-9]', ...props });
    makeObservable(this);
    if (!props?.valueSetSkip) {
      this.domain.valueSet(() => this.valueInput?.split(' ') as [string, string]);
      this.valueSet(() => model.value?.join(' '));
    }
  }

  @computed
  public get maskOptions() {
    return { mask: VInputPassportModel.mask };
  }
}
