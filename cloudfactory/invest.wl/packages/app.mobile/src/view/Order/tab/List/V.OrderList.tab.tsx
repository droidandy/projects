import { DisposableHolder } from '@invest.wl/common/src/util/disposable.util';
import { IoC } from '@invest.wl/core';
import { mapScreenPropsToProps, VList, VStub } from '@invest.wl/mobile';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { IVOrderListPresentProps, VOrderListPresent, VOrderListPresentTid } from '@invest.wl/view/src/Order/present/V.OrderList.present';
import { observer } from 'mobx-react';
import React from 'react';
import { IVLayoutOperationTabProps } from '../../../Layout/tabs/Operation/V.LayoutOperation.types';
import { VOrderList } from '../../component';
import { VOrderCancelModal } from '../../component/V.OrderCancel.modal';

export interface IVOrderListTabProps extends IVOrderListPresentProps, IVLayoutOperationTabProps, IVLayoutScreenProps {
}

@mapScreenPropsToProps
@observer
export class VOrderListTab extends React.Component<IVOrderListTabProps> {
  private _pr = IoC.get<VOrderListPresent>(VOrderListPresentTid);
  private _dH = new DisposableHolder();

  public componentDidMount() {
    this._pr.filterX.filter.InstrumentName.modelList[0].domain.lvSet(() =>
      this.props.searchModel.value,
    );
    this._dH.push(this.props.filterEventX.subscribe(() => {
      if (this.props.inFocus) this._pr.filterX.modalMain.open();
    }));
    this._pr.init({ pageSize: 20, dateFrom: new Date(), dateTo: new Date(), instrumentId: this.props.instrumentId });
  }

  public componentWillUnmount() {
    this._dH.dispose();
    this._pr.filterX.filter.InstrumentName.modelList[0].domain.lvSet(this.props.searchModel.value);
  }

  public render() {
    if (!this.props.inFocus) return null;

    const { listX, modalCancel, cancelX, filterX, cancelInit, cancelDismiss, cancel, replace, repeat } = this._pr;
    return (
      <>
        <VStub mapXList={[listX]} inFocus={this.props.inFocus}>
          {() => <VOrderList listX={listX} onCancel={cancelInit} onReplace={replace} onRepeat={repeat} />}
        </VStub>
        <VList.Filter model={filterX} />
        {!!cancelX.model &&
        <VOrderCancelModal order={cancelX.model} model={modalCancel} onCancel={cancel} onClose={cancelDismiss} />}
      </>
    );
  }
}
