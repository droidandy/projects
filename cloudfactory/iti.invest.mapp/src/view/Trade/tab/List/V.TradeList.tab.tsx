import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VTradeList } from '../../component';
import {
  IVTradeListPresentProps, VTradeListPresent, VTradeListPresentTid,
} from '@invest.wl/view/src/Trade/present/V.TradeList.present';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { DisposableHolder } from '@invest.wl/common/src/util/disposable.util';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { VList, VStub, VContent } from '@invest.wl/mobile/src/view/kit';
import { IVLayoutOperationTabProps } from '../../../Layout/tabs/Operation/V.LayoutOperation.types';
import {VThemeStore} from "@invest.wl/view/src/Theme/V.Theme.store";
import {VThemeStoreTid} from "@invest.wl/view/src/Theme/V.Theme.types";

export interface IVTradeListTabProps extends IVTradeListPresentProps, IVLayoutOperationTabProps, IVLayoutScreenProps {
}

@mapScreenPropsToProps
@observer
export class VTradeListTab extends React.Component<IVTradeListTabProps> {
  private _pr = IoC.get<VTradeListPresent>(VTradeListPresentTid);
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

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
    const { listX, filterX } = this._pr;
    const { color } = this.theme;
    return (
      <VContent style={{backgroundColor: color.base}}>
        <VStub mapXList={[listX]} inFocus={this.props.inFocus}>
          {() => <VTradeList listX={listX} />}
        </VStub>
        <VList.Filter model={filterX} />
      </VContent>
    );
  }
}
