import React from 'react';
import {
  IVPortfelInstrumentTypePresentProps, VPortfelInstrumentTypePresent, VPortfelInstrumentTypePresentTid,
} from '@invest.wl/view/src/Portfel/present/V.PortfelInstrumentType.present';
import {VContainer, VContent, VNavBar, VStatusBar, VStub, VText, VRow, VFormat} from '@invest.wl/mobile/src/view/kit';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VPortfelPLInstrumentList } from '../../component/V.PortfelPLInstrumentList.component';
import { observer } from 'mobx-react';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { IVPortfelPLByInstrumentModel } from '@invest.wl/view/src/Portfel/model/V.PortfelPLByInstrument.model';
import { EVInstrumentScreen } from '@invest.wl/view/src/Instrument/V.Instrument.types';
import {VThemeStore} from "@invest.wl/view/src/Theme/V.Theme.store";
import {VThemeStoreTid} from "@invest.wl/view/src/Theme/V.Theme.types";
import {EDInstrumentAssetType} from "@invest.wl/core/src/index";

@mapScreenPropsToProps
@observer
export class VPortfelInstrumentTypeScreen extends React.Component<IVPortfelInstrumentTypePresentProps & IVLayoutScreenProps> {
  private pr = IoC.get<VPortfelInstrumentTypePresent>(VPortfelInstrumentTypePresentTid);
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  constructor(props: IVPortfelInstrumentTypePresentProps & IVLayoutScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this.pr.init(this.props);
  }

  public render() {
    const { inFocus } = this.props;
    return (
      <VContainer>
        <VStatusBar translucent />
        <VNavBar>
          <VNavBar.Back />
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
    const { space } = this.theme;
    const {inFocus} = this.props;
    const plGroupX = this.pr.plGroupX.model;
    const instrumentAssetType = inFocus ? plGroupX?.instrumentAssetType : undefined;
    const list = plGroupX?.groupX.listX.list || [];
    const notMoney = plGroupX?.domain.instrumentAssetType !== EDInstrumentAssetType.Money;
    return (
      <>
        <VRow wrap={false} overflow={'hidden'} width={'100%'} pb={space.lg} ph={space.lg} justifyContent={'space-between'} alignItems={'flex-end'}>
          <VText numberOfLines={1} font={'title3'} >
            {instrumentAssetType || ''}
          </VText>
          {notMoney && <VFormat.Number size={'md'}>{plGroupX?.marketValue || ''}</VFormat.Number>}
        </VRow>
        <VPortfelPLInstrumentList list={list} onPress={this._instrumentNav} />
      </>
    );
  }

  private _instrumentNav = (model: IVPortfelPLByInstrumentModel) =>
    this._router.navigateTo(EVInstrumentScreen.Instrument, { cid: model.identity.dto.id });
}
