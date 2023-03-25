import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import {
  IVOrderListPresentProps, VOrderListPresent, VOrderListPresentTid,
} from '@invest.wl/view/src/Order/present/V.OrderList.present';
import { VOrderList } from '../../component';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { VOrderCancelModal } from '../../component/V.OrderCancel.modal';
import { DisposableHolder } from '@invest.wl/common/src/util/disposable.util';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { VList, VStub, VContent } from '@invest.wl/mobile/src/view/kit';
import { IVLayoutOperationTabProps } from '../../../Layout/tabs/Operation/V.LayoutOperation.types';
import {VThemeStore} from "@invest.wl/view/src/Theme/V.Theme.store";
import {VThemeStoreTid} from "@invest.wl/view/src/Theme/V.Theme.types";
// import {VStubEmpty} from "@invest.wl/mobile/src/view/kit/Feedback/Stub/Empty/V.StubEmpty.component";

export interface IVOrderListTabProps extends IVOrderListPresentProps, IVLayoutOperationTabProps, IVLayoutScreenProps {
}

@mapScreenPropsToProps
@observer
export class VOrderListTab extends React.Component<IVOrderListTabProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
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
    const { color } = this.theme;
    if (!this.props.inFocus) return null;
    const { listX, modalCancel, cancelX, filterX, cancelInit, cancelDismiss, cancel, replace, repeat } = this._pr;
    console.log('this._pr:: ', this._pr)
    return (
      <VContent style={{backgroundColor: color.base}}>
        <VStub
          mapXList={[listX]}
          inFocus={this.props.inFocus}
          // empty={<VStubEmpty>ytdsd</VStubEmpty>}
        >
          {() => <VOrderList listX={listX} onCancel={cancelInit} onReplace={replace} onRepeat={repeat} />}
        </VStub>
        <VList.Filter model={filterX} />
        {!!cancelX.model &&
        <VOrderCancelModal order={cancelX.model} model={modalCancel} onCancel={cancel} onClose={cancelDismiss} />}
      </VContent>
    );
  }
}
