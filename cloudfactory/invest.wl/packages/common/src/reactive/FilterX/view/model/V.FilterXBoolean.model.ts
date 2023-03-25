import { computed, makeObservable } from 'mobx';
import { ILambda } from '../../../LambdaX';
import { DFilterXModel } from '../../domain/model/D.FilterX.model';
import { IVFilterXConfigModel } from '../V.FilterX.types';
import { VFilterXModel } from './V.FilterX.model';

export class VFilterXBooleanModel extends VFilterXModel<boolean> {
  @computed
  public get display() {
    return this.domain.dto ? 'Да' : 'Нет';
  }

  constructor(dtoLV: ILambda<DFilterXModel<boolean>>, config: IVFilterXConfigModel<boolean>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
