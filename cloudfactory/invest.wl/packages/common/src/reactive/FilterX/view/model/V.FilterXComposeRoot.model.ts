import { computed, makeObservable } from 'mobx';
import { ILambda } from '../../../LambdaX';
import { IDFilterXComposeModel, TDFilterXType } from '../../domain/D.FilterX.types';
import { VFilterXConfig } from '../V.FilterX.config';
import { IVFilterXComposeRootModel, IVFilterXConfigModel } from '../V.FilterX.types';
import { VFilterXModel } from './V.FilterX.model';
import { VFilterXComposeModel } from './V.FilterXCompose.model';

export class VFilterXComposeRootModel<T extends TDFilterXType> extends VFilterXComposeModel<T>
  implements IVFilterXComposeRootModel<T> {
  @computed
  public get modelList() {
    return this.list.filter(f => (f instanceof VFilterXModel)) as VFilterXModel<T>[];
  }

  @computed
  public get list() {
    return this.domain.dto.map(f => {
      const VModel = VFilterXConfig.domain2view(f);
      return new VModel(f, this.config);
    });
  }

  constructor(dtoLV: ILambda<IDFilterXComposeModel<T>>, config: IVFilterXConfigModel<T>) {
    super(dtoLV, config);
    makeObservable(this);
  }
}
