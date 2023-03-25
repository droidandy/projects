import { computed, makeObservable } from 'mobx';
import { ILambda } from '../../../LambdaX';
import { DSortXModel } from '../../domain/model/D.SortX.model';
import { IVSortXConfigModel } from '../V.SortX.types';
import { VSortXModel } from './V.SortX.model';

export class VSortXBooleanModel extends VSortXModel<boolean> {
  constructor(dtoLV: ILambda<DSortXModel<boolean>>, config: IVSortXConfigModel<boolean>) {
    super(dtoLV, config);
    makeObservable(this);
  }

  @computed
  public get display() {
    if (this.domain.isEmpty) return undefined;
    return this.domain.dto;
  }
}
