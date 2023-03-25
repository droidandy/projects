import { ILambda } from '../LambdaX';
import { MapX } from '../MapX/MapX';
import { IDModelX, IVModelX } from '../ModelX/ModelX.types';
import { VModelX } from '../ModelX/V.ModelX.model';
import { IDGroupXModel, IVGroupXModel, IVGroupXModelProps } from './GroupX.types';

export class VGroupXModel<M extends IVModelX<DM>, G extends IVModelX<DG>, DM extends IDModelX<any>, O extends string | number, Data extends Record<string, any>, DG extends IDModelX<any>>
  extends VModelX<IDGroupXModel<DM, O, Data, DG>> implements IVGroupXModel<M, G, DM, O, Data, DG> {
  constructor(dtoLV: ILambda<IDGroupXModel<DM, O, Data, DG>>, private _props: IVGroupXModelProps<M, G, DM, O, Data, DG>) {
    super(dtoLV);
  }

  public listX = new MapX.VList(this.domain.dto.source,
    () => this.domain.list, this._props.itemFabric);

  public innerX = this.domain.innerX ? new MapX.VList(this.domain.dto.source,
    () => this.domain.innerX!.list, this._props.groupFabric) : undefined;

  public innerAllX = this.domain.innerX ? new MapX.V(this.domain.dto.source,
    () => this.domain.innerAllX!.model, this._props.groupFabric) : undefined;
}
