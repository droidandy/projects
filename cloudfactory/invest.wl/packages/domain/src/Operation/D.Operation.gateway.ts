import { AsynX, IAsynXPagedOpts, MapX } from '@invest.wl/common';
import { IDOperationDepositCreateDTO, IDOperationItemDTO, Inject, Injectable, Newable } from '@invest.wl/core';
import { DOperationAdapterTid, IDOperationAdapter } from './D.Operation.types';
import { DOperationModel, DOperationModelTid } from './model/D.Operation.model';

export const DOperationGatewayTid = Symbol.for('DOperationGatewayTid');

@Injectable()
export class DOperationGateway {
  constructor(
    @Inject(DOperationAdapterTid) private adapter: IDOperationAdapter,
    @Inject(DOperationModelTid) private model: Newable<typeof DOperationModel>,
  ) {}

  public list(opts: IAsynXPagedOpts<IDOperationItemDTO, IDOperationAdapter['List']>) {
    const source = new AsynX.Paged(this.adapter.List.bind(this.adapter), opts);
    return new MapX.DList(source, () => source.data?.data, lv => new this.model(lv));
  }

  public depositCreate(req: IDOperationDepositCreateDTO) {
    return this.adapter.DepositCreate(req);
  }
}
