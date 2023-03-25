import { computed, makeObservable } from 'mobx';
import { IAsynX } from '../AsynX/AsynX.types';
import { ILambda, LambdaX } from '../LambdaX';
import { IDModelX, IDModelXValue, IModelBase, IVModelX, IVModelXValue } from '../ModelX/ModelX.types';
import { MapXBase, MapXListBase } from './MapX.base';
import { IVMapX, IVMapXList } from './MapX.types';

export class VMapX<DModel extends IDModelXValue<any>, VModel extends IVModelXValue<any>, Source extends IAsynX = IAsynX>
  extends MapXBase<DModel, VModel> implements IVMapX<VModel, Source> {
  constructor(
    public source: Source,
    _v: ILambda<DModel | undefined>,
    _fabric: (v: ILambda<DModel>) => VModel,
  ) {
    super(_v, _fabric);
  }
}

export class VMapXList<DModel extends IDModelX<IModelBase>, VModel extends IVModelX<any>, Source extends IAsynX = IAsynX>
  extends MapXListBase<DModel, VModel>
  implements IVMapXList<VModel, Source> {
  constructor(
    public source: Source,
    _v: ILambda<DModel[] | undefined>,
    _fabric: (v: ILambda<DModel>, index: number) => VModel,
  ) {
    super(_v, _fabric);
  }
}

export class VMapXProxy<DModel extends IDModelXValue<any>, VModel extends IVModelXValue<any>, Source extends IAsynX = IAsynX>
implements IVMapX<VModel, Source> {
  constructor(
    private _v: ILambda<VModel | undefined>,
    public source: Source,
  ) {
    makeObservable(this);
  }

  @computed
  public get model(): VModel | undefined {
    return LambdaX.resolve(this._v);
  }
}

export class VMapXListProxy<DModel extends IDModelX<IModelBase>, VModel extends IVModelX<any>, Source extends IAsynX = IAsynX>
implements IVMapXList<VModel, Source> {
  constructor(
    private _v: ILambda<VModel[] | undefined>,
    public source: Source,
  ) {
    makeObservable(this);
  }

  @computed
  public get list(): VModel[] {
    return LambdaX.resolve(this._v) ?? [];
  }
}
