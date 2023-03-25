import { DModelX, IDModelX, ILambda, IMapXList, MapX } from '@invest.wl/common';
import {
  EDAccountBoard,
  IDAccountAgreementDTO,
  IDAccountByAgreementDTO,
  IDAccountItemDTO,
  IDAccountQUIKAgreementDTO,
  IDAccountQUIKItemDTO,
  Injectable,
  TModelId,
} from '@invest.wl/core';
import { computed, makeObservable } from 'mobx';
import { DAccountModel } from './D.Account.model';

export const DAccountByAgreementModelTid = Symbol.for('DAccountByAgreementModelTid');
export const DAccountByAgreementModelFactoryTid = Symbol.for('DAccountByAgreementModelFactoryTid');

export type IDAccountItem = IDAccountItemDTO | IDAccountQUIKItemDTO;

export type IDAccountByAgreementModelFactory = <T extends IDAccountItem>(i: ILambda<IDAccountByAgreementDTO<T>>) => IDAccountByAgreementModel<T>;

type TDTO<T extends IDAccountItem> = IDAccountByAgreementDTO<T>;

export interface IDAccountByAgreementModel<T extends IDAccountItem, DTO extends TDTO<T> = TDTO<T>> extends IDModelX<DTO> {
  readonly agreement: T extends IDAccountItemDTO ? IDAccountAgreementDTO : IDAccountQUIKAgreementDTO;
  readonly accountIdList: TModelId[];
  readonly accountBoardList: EDAccountBoard[];
  readonly listX: IMapXList<DAccountModel>;
  getByAccountId(id: TModelId): T | undefined;
}

@Injectable()
export class DAccountByAgreementModel<I extends IDAccountItem, DTO extends TDTO<I> = TDTO<I>>
  extends DModelX<DTO> implements IDAccountByAgreementModel<I, DTO> {
  @computed
  public get agreement() {
    return this.dto.AccountList[0].Agreement as I extends IDAccountItemDTO ? IDAccountAgreementDTO : IDAccountQUIKAgreementDTO;
  }

  public listX = new MapX.BaseList(
    () => this.dto.AccountList,
    v => new DAccountModel(v as any),
  );

  @computed
  public get accountIdList() {
    return this.dto.AccountList.map(a => a.id);
  }

  @computed
  public get accountBoardList() {
    return this.dto.AccountList.map(a => a.Board);
  }

  constructor(dtoLV: ILambda<DTO>) {
    super(dtoLV);
    makeObservable(this);
  }

  public getByAccountId(id: TModelId) {
    return this.dto.AccountList.find(a => a.id === id);
  }
}
