import { Formatter } from '@invest.wl/common';
import { IDInputModel } from '@invest.wl/domain';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * Ввод даты.
 */
export class VInputDateModel extends VInputModel<IDInputModel<Date>> {
  constructor(model: IDInputModel<Date>, props?: IVInputModelProps) {
    super(model, props);
    if (!props?.valueSetSkip) {
      this.domain.valueSet(() => this.valueInput ? new Date(this.valueInput) : undefined);
      this.valueSet(() => model.value && Formatter.date(model.value, { pattern: 'default' }));
    }
  }
}
