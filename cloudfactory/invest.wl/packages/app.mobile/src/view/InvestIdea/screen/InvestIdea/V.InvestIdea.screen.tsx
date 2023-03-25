import { IoC } from '@invest.wl/core';
import {
  mapScreenPropsToProps, VCard, VCol, VContainer, VContent, VIcon, VNavBar, VRow, VStatusBar, VStub, VText, VTouchable,
} from '@invest.wl/mobile';
import {
  IVInvestIdeaPresentProps, VInvestIdeaPresent, VInvestIdeaPresentTid,
} from '@invest.wl/view/src/InvestIdea/present/V.InvestIdea.present';
import { EVOwnerScreen } from '@invest.wl/view/src/Owner/V.Owner.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VOrderCreateButtons } from '_view/Order/component/V.OrderCreateButtons.component';
import { computed, makeObservable, when } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VInvestIdea } from '../../component';
import {
  VInstrumentHistoryPresent, VInstrumentHistoryPresentTid,
} from '@invest.wl/view/src/Instrument/present/V.InstrumentHistory.present';
import { DisposableHolder } from '@invest.wl/common';

export interface IVInvestIdeaScreenProps extends IVInvestIdeaPresentProps {
}

@mapScreenPropsToProps
@observer
export class VInvestIdeaScreen extends React.Component<IVInvestIdeaScreenProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);
  private _pr = IoC.get<VInvestIdeaPresent>(VInvestIdeaPresentTid);
  private _instrumentHistoryPr = IoC.get<VInstrumentHistoryPresent>(VInstrumentHistoryPresentTid);

  private _dh = new DisposableHolder();

  constructor(props: IVInvestIdeaScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this._pr.init(this.props);
    this._dh.push(when(() => !!this._pr.infoX.model?.instrumentIdentity, () => {
      this._instrumentHistoryPr.init({ cid: this._pr.infoX.model!.instrumentIdentity!.dto.id });
    }));
  }

  public componentWillUnmount() {
    this._dh.dispose();
  }

  public render() {
    const { infoX } = this._pr;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Витрина'} />
        </VNavBar>
        <VContent footerTabs pa={this._theme.space.lg}>
          <VStub mapXList={[infoX]}>
            {() => this.contentRender}
          </VStub>
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    const { space, color } = this._theme;
    const { infoX } = this._pr;
    const { marketHistoryListX, periodSelect, periodSelected, marketHistoryPeriodList } = this._instrumentHistoryPr;
    return (
      <>
        <VInvestIdea model={infoX.model!} historyModel={marketHistoryListX.model} periodSelect={periodSelect}
          periodSelected={periodSelected} periodList={marketHistoryPeriodList} />
        {!!infoX.model?.instrumentIdentity && (
          <VCard mt={space.lg} alignItems={'center'} pa={space.lg}>
            <VRow alignItems={'center'} justifyContent={'center'}>
              <VIcon name={'warning'} fontSize={24} color={color.primary1} />
              <VTouchable.Opacity ml={space.sm} onPress={this._ownerTermsNav}>
                <VText font={'body22'}>{'Важно! Прочтите перед покупкой'}</VText>
                <VCol height={1} bg={color.baseInvert} />
              </VTouchable.Opacity>
            </VRow>
            <VOrderCreateButtons exchangeShow cid={infoX.model.instrumentIdentity.dto.id}
              alignSelf={'stretch'} mt={space.lg} />
          </VCard>
        )}
      </>
    );
  }

  private _ownerTermsNav = () => this._router.navigateTo(EVOwnerScreen.OwnerTerms);
}
