import { AsynX, IAsynXOpts, IAsynXPagedOpts, MapX } from '@invest.wl/common';
import {
  IDDocumentCreateManyRequestDTO,
  IDDocumentCreateRequestDTO,
  IDDocumentDTO,
  IDDocumentSignConfirmRequestDTO,
  IDDocumentSignPrepareRequestDTO,
  IDDocumentSmsSendRequestDTO,
  Inject,
  Injectable,
  Newable,
} from '@invest.wl/core';
import { DDocumentAdapterTid, IDDocumentAdapter } from './D.Document.types';
import { DDocumentModel, DDocumentModelTid } from './model/D.Document.model';

@Injectable()
export class DDocumentGateway {
  constructor(
    @Inject(DDocumentAdapterTid) private adapter: IDDocumentAdapter,
    @Inject(DDocumentModelTid) private model: Newable<typeof DDocumentModel>,
  ) {}

  public listSelf(opts: IAsynXPagedOpts<IDDocumentDTO, IDDocumentAdapter['listSelf']>) {
    const source = new AsynX.Paged(this.adapter.listSelf.bind(this.adapter), opts);
    return new MapX.DList(source, () => source.data?.data.list, lv => new this.model(lv));
  }

  public listSelfMany(opts: IAsynXOpts<IDDocumentAdapter['listSelfMany']>) {
    const source = new AsynX(this.adapter.listSelfMany.bind(this.adapter), opts);
    return new MapX.DList(source, () => source.data?.data.list, lv => new this.model(lv));
  }

  public create(req: IDDocumentCreateRequestDTO) {
    return this.adapter.create(req);
  }

  public createMany(req: IDDocumentCreateManyRequestDTO) {
    return this.adapter.createMany(req);
  }

  public signPrepare(req: IDDocumentSignPrepareRequestDTO) {
    return this.adapter.signPrepare(req);
  }

  public signConfirm(req: IDDocumentSignConfirmRequestDTO) {
    return this.adapter.signConfirm(req);
  }

  public smsSend(req: IDDocumentSmsSendRequestDTO) {
    return this.adapter.smsSend(req);
  }
}
