import { computed, makeObservable } from 'mobx';
import { ILambda } from '../../../LambdaX';
import { DSortXModel } from '../../domain/model/D.SortX.model';
import { IVSortXConfigModel } from '../V.SortX.types';
import { VSortXModel } from './V.SortX.model';

export class VSortXNumberModel extends VSortXModel<number> {
  @computed
  public get display() {
    if (this.domain.isEmpty) return undefined;
    return this.domain.dto;
  }

  constructor(dtoLV: ILambda<DSortXModel<number>>, config: IVSortXConfigModel<number>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
