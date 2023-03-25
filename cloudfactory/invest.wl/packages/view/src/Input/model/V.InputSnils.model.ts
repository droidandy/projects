import { IDInputModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

// Проверка контрольного числа Страхового номера проводится только для номеров больше номера 001-001-998
// ViewModel для ввода СНИЛС

export class VInputSnilsModel extends VInputModel {
  public static mask = '[000]-[000]-[000] [00]';

  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, props);
    makeObservable(this);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput?.replace(/\D/g, ''));
  }

  @computed
  public get maskOptions() {
    return { mask: VInputSnilsModel.mask };
  }
}
