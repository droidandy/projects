import { computed, makeObservable } from 'mobx';
import { IAsynX } from '../AsynX/AsynX.types';
import { ILambda, lambdaResolve } from '../LambdaX';
import { IDModelX, IDModelXValue, IModelBase } from '../ModelX/ModelX.types';
import { MapXBase, MapXListBase } from './MapX.base';
import { IDMapX, IDMapXList } from './MapX.types';

export class DMapX<Item, Model extends IDModelXValue<Item>, Source extends IAsynX = IAsynX>
  extends MapXBase<Item, Model> implements IDMapX<Model, Source> {
  constructor(
    public source: Source,
    _v: ILambda<Item | undefined>,
    _fabric: (v: ILambda<Item>) => Model,
  ) {
    super(_v, _fabric);
  }
}

export class DMapXList<Item extends IModelBase, Model extends IDModelX<Item>, Source extends IAsynX = IAsynX>
  extends MapXListBase<Item, Model> implements IDMapXList<Model, Source> {
  constructor(
    public source: Source,
    _v: ILambda<Item[] | undefined>,
    _fabric: (v: ILambda<Item>, index: number) => Model,
  ) {
    super(_v, _fabric);
  }
}

export class DMapXProxy<Item, Model extends IDModelXValue<Item>, Source extends IAsynX = IAsynX>
implements IDMapX<Model, Source> {
  constructor(
    private _v: ILambda<Model | undefined>,
    public source: Source,
  ) {
    makeObservable(this);
  }

  @computed
  public get model(): Model | undefined {
    return lambdaResolve(this._v);
  }
}

export class DMapXListProxy<Item extends IModelBase, Model extends IDModelX<Item>, Source extends IAsynX = IAsynX>
implements IDMapXList<Model, Source> {
  constructor(
    private _v: ILambda<Model[] | undefined>,
    public source: Source,
  ) {
    makeObservable(this);
  }

  @computed
  public get list(): Model[] {
    return lambdaResolve(this._v) ?? [];
  }
}

