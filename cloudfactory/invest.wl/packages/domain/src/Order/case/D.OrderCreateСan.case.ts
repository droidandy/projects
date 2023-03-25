import { MapX } from '@invest.wl/common';

import { IDInstrumentId, Inject, Injectable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DAccountGateway, DAccountGatewayTid } from '../../Account/D.Account.gateway';
import { DAccountStore, DAccountStoreTid } from '../../Account/D.Account.store';
import { DInstrumentGateway, DInstrumentGatewayTid } from '../../Instrument/D.Instrument.gateway';

export const DOrderCreateCanCaseTid = Symbol.for('DOrderCreateCanCaseTid');

export interface IDOrderCreateCanCaseProps {
  cid: IDInstrumentId;
}

@Injectable()
export class DOrderCreateCanCase {
  @observable.ref public props?: IDOrderCreateCanCaseProps;

  public summaryX = this._gw.summary({
    name: 'DOrderCreateCanCase.summaryX', req: () => this.props?.cid.toJSON(),
  }, { accountList: () => this.accountListX.list });

  private _accountListX = this._accountGw.QUIKList({
    name: 'DOrderCreateCheckCase.accountListX',
    req: () => {
      if (!this.props) return;
      const id = this.props.cid.toJSON(true);
      return id.instrumentId ? id : this.summaryX.model?.dto.Instrument.id.toJSON(true);
    },
  });

  public accountListX = new MapX.DProxyList(
    () => {
      const ids = this._accountStore.agreementIdListSelected.length ? this._accountStore.agreementIdListSelected : undefined;
      return this._accountListX.list.filter(a => a.dto.IsTradingAccount
        && (ids ? ids.includes(a.dto.Agreement.id) : true));
    },
    this._accountListX.source,
  );

  constructor(
    @Inject(DAccountStoreTid) private _accountStore: DAccountStore,
    @Inject(DInstrumentGatewayTid) private _gw: DInstrumentGateway,
    @Inject(DAccountGatewayTid) private _accountGw: DAccountGateway,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDOrderCreateCanCaseProps) {
    this.props = props;
  }

  @action
  public dispose() {
    this.props = undefined;
    this.summaryX.source.clear();
    this._accountListX.source.clear();
  }
}
