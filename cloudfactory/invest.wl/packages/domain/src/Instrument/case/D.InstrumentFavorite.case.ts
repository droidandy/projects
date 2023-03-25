import { ILambda, LambdaX } from '@invest.wl/common';
import { IDInstrumentId, Inject, Injectable } from '@invest.wl/core';
import { action, computed, makeObservable, observable } from 'mobx';
import { DErrorService, DErrorServiceTid } from '../../Error/D.Error.service';
import { EDErrorBusinessCode } from '../../Error/D.Error.types';
import { DInstrumentGateway, DInstrumentGatewayTid } from '../D.Instrument.gateway';
import { IDInstrumentSummaryModel } from '../model/D.InstrumentSummary.model';

export const DInstrumentFavoriteCaseTid = Symbol.for('DInstrumentFavoriteCaseTid');

export interface IDInstrumentFavoriteCaseProps {
  cid: IDInstrumentId;
  model: ILambda<undefined | Pick<IDInstrumentSummaryModel, 'isFavorite'>>;
}

@Injectable()
export class DInstrumentFavoriteCase {
  @observable.ref public props?: IDInstrumentFavoriteCaseProps;

  @computed
  public get model() {
    return LambdaX.resolve(this.props?.model);
  }

  constructor(
    @Inject(DInstrumentGatewayTid) private _gw: DInstrumentGateway,
    @Inject(DErrorServiceTid) private _errorService: DErrorService,
  ) {
    makeObservable(this);
  }

  @action
  public init(props: IDInstrumentFavoriteCaseProps) {
    this.props = props;
  }

  @action
  public toggle = async () => {
    if (!this.props || !this.model) {
      throw this._errorService.businessHandle({
        fn: `${this.constructor.name}::${__FUNCTION__}`,
        code: EDErrorBusinessCode.NotLoaded,
      });
    }
    const res = await this._gw.favoriteUserUpdate({
      ...this.props.cid.toJSON(), isFavorite: !this.model.isFavorite,
    });
    this.model.isFavorite = !this.model.isFavorite;
    return res;
  };
}
