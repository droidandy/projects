import { EDInputInnType, IDInputInnModel } from '@invest.wl/domain';
import { computed, makeObservable } from 'mobx';
import { IVInputModelProps, VInputModel } from './V.Input.model';

// ввод ИНН

export class VInputInnModel extends VInputModel<IDInputInnModel> {
  public static mask = {
    [EDInputInnType.Personal]: '[0000]-[000000]-[00]',
    [EDInputInnType.Legal]: '[0000]-[00000]-[099]',
  };

  constructor(model: IDInputInnModel, props?: IVInputModelProps) {
    super(model, { pattern: '[^0-9]', ...props });
    makeObservable(this);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput?.replace(/[\D]/g, ''));
  }

  @computed
  public get isPersonalProbably() {
    return this.domain.isPersonalProbably;
  }

  @computed
  public get maskOptions() {
    return {
      mask: this.domain.type ? VInputInnModel.mask[this.domain.type] :
        this.isPersonalProbably ? VInputInnModel.mask[EDInputInnType.Personal] : VInputInnModel.mask[EDInputInnType.Legal],
    };
  }
}
