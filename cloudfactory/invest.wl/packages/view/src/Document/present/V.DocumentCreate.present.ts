import { MapX } from '@invest.wl/common';
import { Inject, Injectable, Newable } from '@invest.wl/core';
import { DDocumentCreateCase, DDocumentCreateCaseTid, IDDocumentCreateCaseProps } from '@invest.wl/domain';
import { VDocumentModel, VDocumentModelTid } from '../model/V.Document.model';

export const VDocumentCreatePresentTid = Symbol.for('VDocumentCreatePresentTid');

export interface IVDocumentCreatePresentProps extends IDDocumentCreateCaseProps {
}

@Injectable()
export class VDocumentCreatePresent {
  public listX = new MapX.VList(this.cse.listX.source,
    () => this.cse.listX.list, (m) => new this.model(m));

  constructor(
    @Inject(DDocumentCreateCaseTid) public cse: DDocumentCreateCase,
    @Inject(VDocumentModelTid) private model: Newable<typeof VDocumentModel>,
  ) { }

  public init(props: IVDocumentCreatePresentProps) {
    return this.cse.init(props);
  }
}
