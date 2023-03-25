import { IoC } from '@invest.wl/core';
import { mapScreenPropsToProps, VStub, VStubEmpty } from '@invest.wl/mobile';
import {
  IVInstrumentAlertListPresentProps,
  VInstrumentAlertListPresent,
  VInstrumentAlertListPresentTid,
} from '@invest.wl/view/src/InstrumentAlert/present/V.InstrumentAlertList.present';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { observer } from 'mobx-react';
import React from 'react';
import { ViewToken } from 'react-native';
import { VInstrumentAlertList } from '../component';

export interface IVInstrumentAlertListTabProps extends IVInstrumentAlertListPresentProps {
}

@mapScreenPropsToProps
@observer
export class VInstrumentAlertListTab extends React.Component<IVInstrumentAlertListTabProps & IVLayoutScreenProps> {
  private _pr = IoC.get<VInstrumentAlertListPresent>(VInstrumentAlertListPresentTid);

  public componentDidMount() {
    this._pr.init(this.props);
  }

  public render() {
    const { listX } = this._pr;

    return (
      <VStub mapXList={[listX]} inFocus={this.props.inFocus} empty={<VStubEmpty>{this._pr.emptyText}</VStubEmpty>}>
        {() => (
          <VInstrumentAlertList listX={listX} onCancel={this._pr.delete}
            onViewableItemsChanged={this._onViewableItemsChanged} />
        )}
      </VStub>
    );
  }

  private _onViewableItemsChanged = (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
    this._pr.viewedUpdate(info.viewableItems.map(v => v.item)).then();
  };
}
