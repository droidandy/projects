import { IDInstrumentId, Inject, Injectable, Newable } from '@invest.wl/core';
import { action, makeObservable, observable } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { EDErrorBusinessCode } from '../../Error/D.Error.types';
import { DInstrumentGateway, DInstrumentGatewayTid } from '../../Instrument/D.Instrument.gateway';
import { DInstrumentAlertGateway, DInstrumentAlertGatewayTid } from '../D.InstrumentAlert.gateway';
import { DInstrumentAlertSetModel, DInstrumentAlertSetModelTid } from '../model/D.InstrumentAlertSet.model';

export const DInstrumentAlertCreateCaseTid = Symbol.for('DInstrumentAlertCreateCaseTid');

export interface IDInstrumentAlertCreateCaseProps {
  cid: IDInstrumentId;
}

@Injectable()
export class DInstrumentAlertCreateCase {
  @observable.ref public props?: IDInstrumentAlertCreateCaseProps;

  public setModel = new this._setModel();

  public instrumentSummaryX = this._instrumentGw.summary({
    name: 'DInstrumentAlertCreateCase.InstrumentSummaryX',
    req: () => this.props ? { ...this.props.cid.toJSON() } : undefined,
  });

  constructor(
    @Inject(DInstrumentAlertSetModelTid) private _setModel: Newable<typeof DInstrumentAlertSetModel>,
    @Inject(DInstrumentGatewayTid) private _instrumentGw: DInstrumentGateway,
    @Inject(DInstrumentAlertGatewayTid) private _gw: DInstrumentAlertGateway,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDInstrumentAlertCreateCaseProps) {
    this.props = props;
    this.setModel.fields.instrumentId.valueSet(props.cid.id);
    this.setModel.fields.classCode.valueSet(props.cid.classCode);
    this.setModel.fields.secureCode.valueSet(props.cid.secureCode);
  }

  public async create() {
    if (!this.setModel.isValid) {
      throw this._errorService.businessHandle({
        fn: `${this.constructor.name}::${__FUNCTION__}`,
        code: EDErrorBusinessCode.FormNotValid,
      });
    }
    return await this._gw.set(this.setModel.asDTO);
  }
}
