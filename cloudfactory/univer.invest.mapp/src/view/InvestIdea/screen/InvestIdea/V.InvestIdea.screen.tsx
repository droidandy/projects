import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import {
  IVInvestIdeaPresentProps, VInvestIdeaPresent, VInvestIdeaPresentTid,
} from '@invest.wl/view/src/InvestIdea/present/V.InvestIdea.present';
import { VInvestIdea } from '../../component';
import {
  VCard, VCol, VContainer, VContent, VIcon, VNavBar, VRow, VStatusBar, VText, VTouchable, VStub,
} from '@invest.wl/mobile/src/view/kit';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { EVOwnerScreen } from '@invest.wl/view/src/Owner/V.Owner.types';
import { VOrderCreateButtons } from '_view/Order/component/V.OrderCreateButtons.component';

export interface IVInvestIdeaScreenProps extends IVInvestIdeaPresentProps {
}

@mapScreenPropsToProps
@observer
export class VInvestIdeaScreen extends React.Component<IVInvestIdeaScreenProps> {
  private _pr = IoC.get<VInvestIdeaPresent>(VInvestIdeaPresentTid);
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  constructor(props: IVInvestIdeaScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this._pr.init(this.props);
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
    const {
      infoX, marketHistoryListX, periodSelect, periodSelected, marketHistoryPeriodList, instrumentSummaryX,
    } = this._pr;
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
            <VOrderCreateButtons exchangeShow summary={instrumentSummaryX.model}
              alignSelf={'stretch'} mt={space.lg} />
          </VCard>
        )}
      </>
    );
  }

  private _ownerTermsNav = () => this._router.navigateTo(EVOwnerScreen.OwnerTerms);
}
