import { makeObservable, observable } from 'mobx';
import { ILambda } from '../../../LambdaX';
import { VModelX } from '../../../ModelX/V.ModelX.model';
import { TDSortXType } from '../../domain/D.SortX.types';
import { DSortXModel } from '../../domain/model/D.SortX.model';
import { IVSortXConfigModel, IVSortXModel } from '../V.SortX.types';

export abstract class VSortXModel<T extends TDSortXType> extends VModelX.Value<DSortXModel<T>>
  implements IVSortXModel<T> {
  @observable.ref config: IVSortXConfigModel<T>;

  constructor(dtoLV: ILambda<DSortXModel<T>>, config: IVSortXConfigModel<T>) {
    super(dtoLV);
    makeObservable(this);
    this.config = config;
  }
}
