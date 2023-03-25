import { IAsynX } from '../AsynX/AsynX.types';
import { IDModelXValue, IVModelXValue } from '../ModelX/ModelX.types';

export interface IMapX<Model> {
  readonly model?: Model;
}

export interface IMapXList<Model> {
  readonly list: Model[];
}

export interface IDMapX<Model extends IDModelXValue<any>, Source extends IAsynX = IAsynX>
  extends IMapX<Model> {
  readonly source: Source;
}

export interface IDMapXList<Model extends IDModelXValue<any>, Source extends IAsynX = IAsynX>
  extends IMapXList<Model> {
  readonly source: Source;
}

export interface IVMapX<VModel extends IVModelXValue<IDModelXValue<any>>, Source extends IAsynX = IAsynX>
  extends IMapX<VModel> {
  readonly source: Source;
}

export interface IVMapXList<VModel extends IVModelXValue<IDModelXValue<any>>, Source extends IAsynX = IAsynX>
  extends IMapXList<VModel> {
  readonly source: Source;
}
