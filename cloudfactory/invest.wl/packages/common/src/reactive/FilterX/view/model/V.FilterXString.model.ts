import { computed, makeObservable } from 'mobx';
import { ILambda } from '../../../LambdaX';
import { DFilterXModel } from '../../domain/model/D.FilterX.model';
import { IVFilterXConfigModel } from '../V.FilterX.types';
import { VFilterXModel } from './V.FilterX.model';

export class VFilterXStringModel extends VFilterXModel<string> {
  @computed
  public get display() {
    if (this.domain.isEmpty) return undefined;
    return this.config.domain.dto?.find(i => i.value === this.domain.dto!)?.name;
  }

  constructor(dtoLV: ILambda<DFilterXModel<string>>, config: IVFilterXConfigModel<string>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
