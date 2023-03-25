import React from 'react';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import {
  IVInstrumentAlertListPresentProps, VInstrumentAlertListPresent, VInstrumentAlertListPresentTid,
} from '@invest.wl/view/src/InstrumentAlert/present/V.InstrumentAlertList.present';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { VStub, VContent } from '@invest.wl/mobile/src/view/kit';
import { ViewToken } from 'react-native';
import { VInstrumentAlertList } from '../component';
import { VStubEmpty } from '@invest.wl/mobile/src/view/kit/Feedback/Stub/Empty/V.StubEmpty.component';
import {VThemeStore} from "@invest.wl/view/src/Theme/V.Theme.store";
import {VThemeStoreTid} from "@invest.wl/view/src/Theme/V.Theme.types";

export interface IVInstrumentAlertListTabProps extends IVInstrumentAlertListPresentProps {
}

@mapScreenPropsToProps
@observer
export class VInstrumentAlertListTab extends React.Component<IVInstrumentAlertListTabProps & IVLayoutScreenProps> {
  private _pr = IoC.get<VInstrumentAlertListPresent>(VInstrumentAlertListPresentTid);
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public componentDidMount() {
    this._pr.init(this.props);
  }

  public render() {
    const { listX } = this._pr;
    const { color } = this.theme;

    return (
      <VContent style={{backgroundColor: color.base}}>
        <VStub mapXList={[listX]} inFocus={this.props.inFocus} empty={<VStubEmpty>{this._pr.emptyText}</VStubEmpty>}>
          {() => <VInstrumentAlertList listX={listX} onCancel={this._pr.delete}
                                       onViewableItemsChanged={this._onViewableItemsChanged} />}
        </VStub>
      </VContent>
    );
  }

  private _onViewableItemsChanged = (info: { viewableItems: Array<ViewToken>; changed: Array<ViewToken> }) => {
    this._pr.viewedUpdate(info.viewableItems.map(v => v.item)).then();
  };
}
