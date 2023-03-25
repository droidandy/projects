import {
  EDDocumentStatus,
  EDDocumentType,
  IApiResponse,
  IDDocumentCreateManyRequestDTO,
  IDDocumentCreateManyResponseDTO,
  IDDocumentCreateRequestDTO,
  IDDocumentCreateResponseDTO,
  IDDocumentDTO,
  IDDocumentListManyRequestDTO,
  IDDocumentListManyResponseDTO,
  IDDocumentListRequestDTO,
  IDDocumentListResponseDTO,
  IDDocumentSignConfirmRequestDTO,
  IDDocumentSignConfirmResponseDTO,
  IDDocumentSignPrepareRequestDTO,
  IDDocumentSignPrepareResponseDTO,
  IDDocumentSmsSendRequestDTO,
  IDDocumentSmsSendResponseDTO,
  Inject,
  Injectable,
} from '@invest.wl/core';
import { DDateUtil } from '@invest.wl/domain/src/Date/D.Date.util';
import { IDDocumentAdapter } from '@invest.wl/domain/src/Document/D.Document.types';
import { ISConfigStore, SConfigStoreTid } from '@invest.wl/system/src/Config/S.Config.types';
import { STransportDocumentService, STransportDocumentServiceTid } from '@invest.wl/system/src/Transport/Document/S.TransportDocument.service';
import flatMap from 'lodash/flatMap';
import uniqBy from 'lodash/uniqBy';

@Injectable()
export class DDocumentAdapter implements IDDocumentAdapter {
  constructor(
    @Inject(STransportDocumentServiceTid) private _tpDocument: STransportDocumentService,
    @Inject(SConfigStoreTid) private _cfg: ISConfigStore,
  ) {}

  public listSelf(req: IDDocumentListRequestDTO): Promise<IApiResponse<IDDocumentListResponseDTO>> {
    return this._tpDocument.ListSelf({
      source_id: req.contextId, limit: req.limit, offset: req.offset,
      statuses: req.statusList?.join(), types: req.typeList?.join(),
    }).then(res => ({
      code: 0, data: {
        list: res.document.map(d => ({
          ...d, createDate: d.create_date, storageLink: d.storage_link,
          sign: { date: d.document_sign.sign_date }, status: d.status as unknown as EDDocumentStatus,
          type: d.type as unknown as EDDocumentType,
        } as IDDocumentDTO)),
      },
    }));
  }

  public listSelfMany(req: IDDocumentListManyRequestDTO): Promise<IApiResponse<IDDocumentListManyResponseDTO>> {
    if (!req.list) return Promise.resolve({ code: 0, data: { list: [] } });
    return Promise.all(req.list.map(r => this.listSelf(r)))
      .then(res => {
        // одни и те же сущности из двух и более запросов считаются разными?
        const list = uniqBy(flatMap(res, item => item.data.list), item => item.id);
        return { code: 0, data: { list } };
      });
  }

  public create(req: IDDocumentCreateRequestDTO): Promise<IApiResponse<IDDocumentCreateResponseDTO>> {
    return this._tpDocument.Create({
      document_templates: req.templateList, source_object_id: req.contextId,
      source_object_type: req.contextType ? parseInt(req.contextType, 10) : undefined,
    }).then(res => ({ code: 0, data: {} }));
  }

  public createMany(req: IDDocumentCreateManyRequestDTO): Promise<IApiResponse<IDDocumentCreateManyResponseDTO>> {
    if (!req.list) return Promise.resolve({ code: 0, data: {} });
    return Promise.all(req.list.map(r => this.create(r)))
      .then(res => ({ code: 0, data: {} }));
    ;
  }

  public signPrepare(req: IDDocumentSignPrepareRequestDTO): Promise<IApiResponse<IDDocumentSignPrepareResponseDTO>> {
    return this._tpDocument.Prepare({ documents: req.idList })
      .then(res => ({ code: 0, data: res }));
  }

  public signConfirm(req: IDDocumentSignConfirmRequestDTO): Promise<IApiResponse<IDDocumentSignConfirmResponseDTO>> {
    return this._tpDocument.Confirm(req).then(res => {
      const contextType = res.order_id ? 'order' : res.trade_id ? 'trade' : undefined;
      return { code: 0, data: { contextType, contextId: res.trade_id ?? res.order_id } };
    });
  }

  public smsSend(req: IDDocumentSmsSendRequestDTO): Promise<IApiResponse<IDDocumentSmsSendResponseDTO>> {
    return this._tpDocument.Resend(req).then(res => ({ code: 0, data: res }));
  }

  public get createReloadInterval() {
    return this._cfg.documentCreateReloadInterval || 3000;
  }

  public get codeLength() {
    return this._cfg.documentSmsCodeLength || 4;
  }

  public get templateMap() {
    return this._cfg.documentTemplateMap || {};
  }

  public get smsResentTimeout() {
    return this._cfg.documentSmsResendTimeout || 1 * DDateUtil.MINUTE;
  }
}
