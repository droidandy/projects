import { AsynX, DisposableHolder } from '@invest.wl/common';

import { EDDocumentStatus, errorWhenCancelled, IDDocumentCreateRequestDTO, IDDocumentListRequestDTO, IErrorDTO, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable, runInAction, when } from 'mobx';
import { DDocumentGateway } from '../D.Document.gateway';
import { DDocumentConfigTid, DDocumentGatewayTid, IDDocumentConfig } from '../D.Document.types';

export const DDocumentCreateCaseTid = Symbol.for('DDocumentCreateCaseTid');

export interface IDDocumentCreateCaseProps extends Pick<IDDocumentListRequestDTO, 'statusList' | 'typeList'> {
  createList: IDDocumentCreateRequestDTO[];
}

@Injectable()
export class DDocumentCreateCase {
  @observable.ref public props?: IDDocumentCreateCaseProps;
  @observable public isBusy = false;

  @computed
  private get _createCount() {
    return this.props?.createList ? this.props.createList.reduce((acc, i) => acc + (i.templateList?.length || 0), 0) : undefined;
  }

  private _createMany = new AsynX(this._gw.createMany.bind(this._gw), {
    name: 'DDocumentCreateCase._createMany',
    req: () => this.props ? { list: this.props.createList } : undefined,
    onError: (error: IErrorDTO) => {
      error.fn = `${this.constructor.name}::_createMultiple`;
      error.message = `Ошибка подписания. ${error.message}`;
    },
  });

  public listX = this._gw.listSelfMany({
    name: 'DDocumentCreateCase.listSelfX',
    req: () => {
      if (!this.props || this._createMany.isLoading || !this._createMany.isLoaded || !!this._createMany.error) return;
      const { statusList, typeList } = this.props;
      const list = this.props.createList;
      return {
        list: list?.length
          ? list.map(o => ({ contextId: o.contextId, statusList, typeList }))
          : [{ statusList, typeList }],
      };
    },
    onError: (error: IErrorDTO) => {
      error.fn = `${this.constructor.name}:listSelfX`;
      error.message = `Ошибка загрузки документов. ${error.message}`;
      return error;
    },
    onLoaded: (req, res) => {
      setTimeout(() => {
        if (this.isCreatedAll) {
          runInAction(() => this.isBusy = false);
          this.listX.source.stop();
        }
      }, 10);
    },
    interval: this._cfg.createReloadInterval,
  });

  private _dH = new DisposableHolder();

  constructor(
    @Inject(DDocumentGatewayTid) private _gw: DDocumentGateway,
    @Inject(DDocumentConfigTid) private _cfg: IDDocumentConfig,
  ) {
    makeObservable(this);
  }

  @action
  public async init(props: IDDocumentCreateCaseProps) {
    this.props = props;
    this.isBusy = true;
    try {
      const waiter = when(() => {
        if (this.listX.source.error) throw this.listX.source.error;
        return this.isCreatedAll;
      });
      this._dH.push(waiter.cancel);
      await waiter;
    } catch (e: any) {
      // отмена ожидания не является бизнесовой ошибкой
      if (e === errorWhenCancelled) return;
      throw e;
    }
  }

  public dispose() {
    this._dH.dispose();
  }

  @computed
  public get newList() {
    return this.listX.list.filter(d => d.dto.status === EDDocumentStatus.New);
  }

  @computed
  public get isCreatedAll() {
    return this.newList.length >= this._createCount!;
  }
}
