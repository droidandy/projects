import { IDInputModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * Поле ввода ОГРН.
 */
export class VInputOgrnModel extends VInputModel {
  public static mask = '[0000000000000]';

  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, { pattern: '[^0-9]', ...props });
    makeObservable(this);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput?.replace(/\D/g, ''));
  }

  @computed
  public get maskOptions() {
    return { mask: VInputOgrnModel.mask };
  }
}
