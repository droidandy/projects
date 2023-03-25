import { computed, makeObservable } from 'mobx';
import { ILambda } from '../../../LambdaX';
import { IDFilterXComposeModel } from '../../domain/D.FilterX.types';
import { IVFilterXConfigModel } from '../V.FilterX.types';
import { VFilterXComposeModel } from './V.FilterXCompose.model';

export class VFilterXComposeStringModel extends VFilterXComposeModel<string> {
  constructor(dtoLV: ILambda<IDFilterXComposeModel<string>>, config: IVFilterXConfigModel<string>) {
    super(dtoLV, config);
    makeObservable(this);
  }

  @computed
  public get display() {
    return this.domain.dto.map(v => v.dto).join(', ');
  }
}
