import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DDocumentListCase, DDocumentListCaseTid, IDDocumentListCaseProps } from '@invest.wl/domain';
import groupBy from 'lodash/groupBy';
import map from 'lodash/map';
import { computed, makeObservable } from 'mobx';
import { VDocumentModel, VDocumentModelTid } from '../model/V.Document.model';

export const VDocumentListPresentTid = Symbol.for('VDocumentListPresentTid');

export interface IVDocumentListPresentProps extends IDDocumentListCaseProps {
}

@Injectable()
export class VDocumentListPresent {
  public listX = new MapX.VList(this._case.listSelfX.source,
    () => this._case.listSelfX.list, (m) => new this.model(m));

  constructor(
    @Inject(DDocumentListCaseTid) private _case: DDocumentListCase,
    @Inject(VDocumentModelTid) private model: Newable<typeof VDocumentModel>,
  ) {
    makeObservable(this);
  }

  public init(props: IVDocumentListPresentProps) {
    this._case.init(props);
  }

  @computed
  public get sectionsList() {
    const groups = groupBy(this.listX.list, doc => doc.createDate);
    return map(groups, (data, title) => ({ title, data }));
  }
}
