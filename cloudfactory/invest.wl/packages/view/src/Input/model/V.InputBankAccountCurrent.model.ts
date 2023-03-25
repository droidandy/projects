import { IDInputModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * Поле ввода расчетного (текущего) счета.
 */
export class VInputBankAccountCurrentModel extends VInputModel {
  public static mask = '[0000] [0000] [0000] [0000] [0000]';

  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, { pattern: '[^0-9]', ...props });
    makeObservable(this);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput?.replace(/\D/g, ''));
  }

  @computed
  public get maskOptions() {
    return { mask: VInputBankAccountCurrentModel.mask };
  }
}
