import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VContainer, VContent, VImage, VNavBar, VStatusBar, VStub, VStubEmpty, VText,
} from '@invest.wl/mobile/src/view/kit';
import { VPortfelPLGroupHeader, VPortfelPLGroupList } from '../../component';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import {
  IVPortfelPresentProps, VPortfelPresent, VPortfelPresentTid,
} from '@invest.wl/view/src/Portfel/present/V.Portfel.present';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { EDPortfelGroup } from '@invest.wl/core/src/dto/Portfel';
import { VPortfelStore, VPortfelStoreTid } from '@invest.wl/view/src/Portfel/V.Portfel.store';
import {
  VInvestIdeaListPresent,
  VInvestIdeaListPresentTid,
} from '@invest.wl/view/src/InvestIdea/present/V.InvestIdeaList.present';

@mapScreenPropsToProps
@observer
export class VPortfelScreen extends React.Component<IVPortfelPresentProps & IVLayoutScreenProps> {
  private _store = IoC.get<VPortfelStore>(VPortfelStoreTid);
  private pr = IoC.get<VPortfelPresent>(VPortfelPresentTid);
  private ideaListPr = IoC.get<VInvestIdeaListPresent>(VInvestIdeaListPresentTid);
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVPortfelPresentProps & IVLayoutScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this.pr.init(this.props);
    this.ideaListPr.init({ pageSize: 10 });
  }

  public componentWillUnmount() {
    this.pr.dispose();
    this.ideaListPr.dispose();
  }

  @computed
  public get isRoot() {
    return this.props.groupList.includes(EDPortfelGroup.AccountId);
  }

  public render() {
    const account = this.props.inFocus ? this.pr.plGroupX.model?.accountX.model : undefined;
    const { space } = this.theme;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          {this.isRoot && <VNavBar.OperationTabs />}
          {!this.isRoot && <VNavBar.Back />}
          <VNavBar.Title text={account ? account.identity.marketType : ''} />
          {!!account && <VNavBar.TitleSub text={account.identity.name} />}
          {this.props.inFocus && <VNavBar.InstrumentAlertRight />}
        </VNavBar>
        <VContent pa={space.lg} footerTabs noScroll>
          <VStub mapXList={[this.pr.plGroupX]} inFocus={this.props.inFocus}>
            {() => this.contentRender}
          </VStub>
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    const { space, color } = this.theme;
    const model = this.pr.plGroupX.model!;

    return (
      <>
        <VImage mh={-space.lg} pa={space.lg} source={require('../../assets/headerBg.png')}>
          {!this.props.accountIdList && <VText font={'title2'} mb={space.lg}>Портфель</VText>}
          <VPortfelPLGroupHeader model={model} currency={this._store.currency}
            onCurrency={this._store.currencyToggle} />
        </VImage>
        {model.domain.isEmpty && (
          <VStubEmpty>Обратитесь в <VText color={color.primary2} onPress={this.goBank}
          >ближайше отделение банка</VText> и откройте счёт</VStubEmpty>
        )}
        {!model.domain.isEmpty && (
          <VPortfelPLGroupList flex mh={-space.lg} mt={space.md}
            mb={-space.lg} list={model.groupX.innerX?.list || []} />
        )}
      </>
    );
  }

  private goBank = () => {};
}
