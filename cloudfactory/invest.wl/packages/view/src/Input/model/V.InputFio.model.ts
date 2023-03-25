import { IDInputModel } from '@invest.wl/domain';
import { IVInputModelProps, VInputModel } from './V.Input.model';

/**
 * ViewModel для ввода ФИО
 */

export class VInputFioModel extends VInputModel {
  constructor(model: IDInputModel, props?: IVInputModelProps) {
    super(model, { pattern: '/^[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{0,}\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,}(\s[А-ЯA-Z][а-яa-zА-ЯA-Z\-]{1,})?$/', ...props });
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput);
  }
}
