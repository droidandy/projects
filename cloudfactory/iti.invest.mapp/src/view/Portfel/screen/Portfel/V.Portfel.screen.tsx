import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import {
  VContainer, VContent, VNavBar, VStatusBar, VStub, VText, VCol, VImage,
} from '@invest.wl/mobile/src/view/kit';
import { VPortfelPLGroupHeader, VPortfelPLGroupList } from '../../component';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';
import {
  IVPortfelPresentProps, VPortfelPresent, VPortfelPresentTid,
} from '@invest.wl/view/src/Portfel/present/V.Portfel.present';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
// import { VInvestIdeaGallery } from '../../../InvestIdea/component/V.InvestIdeaGallery.component';
import { IVLayoutScreenProps } from '@invest.wl/view/src/Layout/V.Layout.types';
import { EDPortfelGroup } from '@invest.wl/core/src/dto/Portfel';
import { VPortfelStore, VPortfelStoreTid } from '@invest.wl/view/src/Portfel/V.Portfel.store';
import {
  VInvestIdeaListPresent, VInvestIdeaListPresentTid,
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
    // const account = this.props.inFocus ? this.pr.plGroupX.model?.accountX.model : undefined;
    const { color } = this.theme;

    return (
      <VContainer>
        <VStatusBar translucent />
        <VNavBar bg={color.muted4}>
          {this.isRoot && <VNavBar.OperationTabs />}
          {!this.isRoot && <VNavBar.Back />}
          {this.props.inFocus && <VNavBar.InstrumentAlertRight />}
        </VNavBar>
        <VContent style={{backgroundColor: color.muted4}} footerTabs noScroll>
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
    const account = this.props.inFocus ? this.pr.plGroupX.model?.accountX.model : undefined;
    const model = this.pr.plGroupX.model!;
    // const ideaList = this.ideaListPr.ideaListX.list;
    // const isShowIdeas = ideaList.length > 0 && this.isRoot;

    return (
      <>
        <VCol ph={space.lg}>
          {!!account && <VText mb={space.sm}>{account.identity.name}</VText>}
          <VText pt={!!account ?  0 : space.lg} pb={space.lg} font={'title2'}>
            {account ? account.identity.marketType : 'Портфель'}
          </VText>
          <VPortfelPLGroupHeader
            model={model}
            currency={this._store.currency}
            onCurrency={this._store.currencyToggle}
          />
        </VCol>
        {model.domain.isEmpty && (
          <VCol mt={space.md} bg={color.bg} flex justifyContent={'center'} alignItems={'center'}>
            <VImage
              style={{ width: 275, height: 120 }}
              source={require('../../../Layout/assets/logo.png')}
              resizeMode={'contain'}
            />
            <VText ta={'center'}>
              Обратитесь в <VText color={color.accent1} onPress={this.goBank}>{'ближайшее\nотделение банка'}</VText> и откройте счет
            </VText>
          </VCol>
        )}
        {!model.domain.isEmpty && (
          <VPortfelPLGroupList
            bg={color.bg}
            ph={space.lg}
            flex
            mh={-space.lg}
            mt={space.md}
            // mb={isShowIdeas ? undefined : -space.lg}
            mb={-space.lg}
            list={model.groupX.innerX?.list || []}
          />
        )}
        {/*{isShowIdeas && (*/}
        {/*  <VInvestIdeaGallery mt={space.lg} mh={-space.lg} mb={-space.lg} list={ideaList} />*/}
        {/*)}*/}
      </>
    );
  }

  private goBank = () => {};
}
