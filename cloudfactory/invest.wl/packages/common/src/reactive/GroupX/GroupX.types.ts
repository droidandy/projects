import { IAsynX } from '../AsynX/AsynX.types';
import { ILambda } from '../LambdaX';
import { IDMapX, IDMapXList, IVMapX, IVMapXList } from '../MapX/MapX.types';
import { IDModelX, IModelBase, IVModelX } from '../ModelX/ModelX.types';

export interface IDGroupXItemBase<M extends IDModelX<any>> extends IModelBase {
  list: ILambda<M[]>;
}

export interface IDGroupXItem<M extends IDModelX<any>, O extends string | number, D extends Record<string, any>> extends IDGroupXItemBase<M> {
  // Очередь вложенных группировок, первая из них делается самостоятельно при создании экземпляра
  order: ILambda<O[]>;
  // Текущий уровень (index) из order, default = 0
  index?: number;
  data?: D;
}

export interface IDGroupXProps<M extends IDModelX<any>, O extends string | number, D extends Record<string, any>, G extends IDModelX<any>> extends IDGroupXItem<M, O, D> {
  source: IAsynX;
  groupFabric(props: ILambda<IDGroupXItem<M, O, D>>): G;
  groupPropsFabric(order: O): IDGroupXItemBase<M>[];
}

export interface IDGroupXModel<M extends IDModelX<any>, O extends string | number, D extends Record<string, any>, G extends IDModelX<any>> extends IDModelX<IDGroupXProps<M, O, D, G>> {
  readonly index: number;
  readonly order: O[];
  readonly list: M[];
  readonly by: O;
  readonly innerX?: IDMapXList<G>;
  readonly innerAllX?: IDMapX<G>;
}

export interface IVGroupXModel<M extends IVModelX<DM>, G extends IVModelX<DG>, DM extends IDModelX<any>, O extends string | number, Data extends Record<string, any>, DG extends IDModelX<any>> extends IVModelX<IDGroupXModel<DM, O, Data, DG>> {
  readonly listX: IVMapXList<M>;
  readonly innerX?: IVMapXList<G>;
  readonly innerAllX?: IVMapX<G>;
}

export interface IVGroupXModelProps<M extends IVModelX<DM>, G extends IVModelX<DG>, DM extends IDModelX<any>, O extends string | number, Data extends Record<string, any>, DG extends IDModelX<any>> {
  itemFabric(model: ILambda<DM>): M;
  groupFabric(props: ILambda<DG>): G;
}
