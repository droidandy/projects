import { IoC } from '@invest.wl/core';
import { VContainer, VContent, VList, VNavBar, VStatusBar, VStub } from '@invest.wl/mobile';
import { IVInvestIdeaItemModel } from '@invest.wl/view/src/InvestIdea/model/V.InvestIdeaItem.model';
import {
  IVInvestIdeaListPresentProps,
  VInvestIdeaListPresent,
  VInvestIdeaListPresentTid,
} from '@invest.wl/view/src/InvestIdea/present/V.InvestIdeaList.present';
import { EVInvestIdeaScreen } from '@invest.wl/view/src/InvestIdea/V.InvestIdea.types';
import { IVRouterService, VRouterServiceTid } from '@invest.wl/view/src/Router/V.Router.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';
import { VInvestIdeaList } from '../../component';

export interface IVInvestIdeaListScreenProps extends IVInvestIdeaListPresentProps {
}

@observer
export class VInvestIdeaListScreen extends React.Component<IVInvestIdeaListScreenProps> {
  private _pr = IoC.get<VInvestIdeaListPresent>(VInvestIdeaListPresentTid);
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _router = IoC.get<IVRouterService>(VRouterServiceTid);

  public componentDidMount() {
    this._pr.init(this.props);
  }

  public componentWillUnmount() {
    this._pr.dispose();
  }

  public render() {
    const { ideaListX, sortX } = this._pr;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Title text={'Витрина'} />
        </VNavBar>
        <VContent noScroll>
          <VStub mapXList={[ideaListX]} empty={<VStub.Empty>На данный момент предложений нет</VStub.Empty>}>
            {() => <VInvestIdeaList listX={ideaListX} onPress={this._instrumentNav} />}
          </VStub>
          <VContent.Footer>
            <VList.Sort model={sortX} pb={this._theme.kit.Tabs.Footer.sHeight?.md || 0} />
          </VContent.Footer>
        </VContent>
      </VContainer>
    );
  }

  private _instrumentNav = (model: IVInvestIdeaItemModel) =>
    this._router.navigateTo(EVInvestIdeaScreen.InvestIdea, { id: model.id });
}
