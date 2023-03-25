import { computed, makeObservable } from 'mobx';
import { ILambda } from '../../../LambdaX';
import { DFilterXModel } from '../../domain/model/D.FilterX.model';
import { IVFilterXConfigModel } from '../V.FilterX.types';
import { VFilterXModel } from './V.FilterX.model';

export class VFilterXArrayModel<T extends string | number | Date> extends VFilterXModel<T> {
  @computed
  public get display() {
    if (this.domain.isEmpty) return undefined;
    return this.config.domain.dto?.find(i => i.value === this.domain.dto!)?.name;
  }

  constructor(dtoLV: ILambda<DFilterXModel<T>>, config: IVFilterXConfigModel<T>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
