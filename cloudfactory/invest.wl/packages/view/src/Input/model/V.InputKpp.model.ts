import { IDInputModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * ввод КПП.
 */
export class VInputKppModel extends VInputModel {
  public static mask = '[000000000]';

  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, { pattern: '[^0-9]', ...props });
    makeObservable(this);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput?.replace(/\D/g, ''));
  }

  @computed
  public get maskOptions() {
    return { mask: VInputKppModel.mask };
  }
}
