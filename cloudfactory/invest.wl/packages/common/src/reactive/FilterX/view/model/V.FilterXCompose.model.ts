import { makeObservable, observable } from 'mobx';
import { ILambda } from '../../../LambdaX';
import { VModelX } from '../../../ModelX/V.ModelX.model';
import { IDFilterXComposeModel, TDFilterXType } from '../../domain/D.FilterX.types';
import { IVFilterXComposeModel, IVFilterXConfigModel } from '../V.FilterX.types';

export abstract class VFilterXComposeModel<T extends TDFilterXType> extends VModelX.Value<IDFilterXComposeModel<T>>
  implements IVFilterXComposeModel<T> {
  @observable.ref config: IVFilterXConfigModel<T>;

  constructor(dtoLV: ILambda<IDFilterXComposeModel<T>>, config: IVFilterXConfigModel<T>) {
    super(dtoLV);
    this.config = config;
    makeObservable(this);
  }
}
