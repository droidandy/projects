import { TModelId } from '@invest.wl/core';
import { IDInputModel } from '@invest.wl/domain';
import { IVInputModelProps, VInputModel } from './V.Input.model';

export class VInputIdModel<V extends TModelId | undefined = TModelId> extends VInputModel<IDInputModel<V>> {
  constructor(model: IDInputModel<V>, props?: IVInputModelProps) {
    super(model, props);
    if (!props?.valueSetSkip) this.domain.valueSet(() => this.valueInput as V);
  }
}
