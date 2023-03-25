import { makeObservable, observable } from 'mobx';
import { ILambda } from '../../../LambdaX';
import { VModelX } from '../../../ModelX/V.ModelX.model';
import { TDFilterXType } from '../../domain/D.FilterX.types';
import { DFilterXModel } from '../../domain/model/D.FilterX.model';
import { IVFilterXConfigModel, IVFilterXModel } from '../V.FilterX.types';

export class VFilterXModel<T extends TDFilterXType> extends VModelX.Value<DFilterXModel<T>>
  implements IVFilterXModel<T> {
  @observable.ref config: IVFilterXConfigModel<T>;

  constructor(dtoLV: ILambda<DFilterXModel<T>>, config: IVFilterXConfigModel<T>) {
    super(dtoLV);
    this.config = config;
    makeObservable(this);
  }
}
