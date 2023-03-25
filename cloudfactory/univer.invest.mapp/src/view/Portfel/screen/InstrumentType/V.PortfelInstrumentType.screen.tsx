import React from 'react';
import {
  IVPortfelInstrumentTypePresentProps, VPortfelInstrumentTypePresent, VPortfelInstrumentTypePresentTid,
} from '@invest.wl/view/src/Portfel/present/V.PortfelInstrumentType.present';
import { VContainer, VContent, VNavBar, VStatusBar, VStub } from '@invest.wl/mobile/src/view/kit';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VPortfelPLInstrumentList } from '../../component/V.PortfelPLInstrumentList.component';
import { observer } from 'mobx-react';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { IVPortfelPLByInstrumentModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLByInstrument.model';
import { EVInstrumentScreen } from '@invest.wl/view/src/Instrument/V.Instrument.types';

@mapScreenPropsToProps
@observer
export class VPortfelInstrumentTypeScreen extends React.Component<IVPortfelInstrumentTypePresentProps & IVLayoutScreenProps> {
  private pr = IoC.get<VPortfelInstrumentTypePresent>(VPortfelInstrumentTypePresentTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  constructor(props: IVPortfelInstrumentTypePresentProps & IVLayoutScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this.pr.init(this.props);
  }

  public render() {
    const plGroupX = this.pr.plGroupX;
    const { inFocus } = this.props;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={inFocus ? plGroupX.model?.instrumentAssetType || '' : ''} />
        </VNavBar>
        <VContent footerTabs noScroll>
          <VStub mapXList={[this.pr.plGroupX]} inFocus={inFocus}>
            {() => this._contentRender}
          </VStub>
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get _contentRender() {
    return (
      <VPortfelPLInstrumentList
        list={this.pr.plGroupX.model?.groupX.listX.list || []} onPress={this._instrumentNav} />
    );
  }

  private _instrumentNav = (model: IVPortfelPLByInstrumentModel) =>
    this._router.navigateTo(EVInstrumentScreen.Instrument, { cid: model.identity.dto.id });
}
