import { IoC } from '@invest.wl/core';
import { VContainer, VContent, VNavBar, VStatusBar, VText } from '@invest.wl/mobile';
import { IVNewsListPresentProps, VNewsListPresent, VNewsListPresentTid } from '@invest.wl/view/src/News/present/V.NewsList.present';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVNewsListScreenProps extends IVNewsListPresentProps { }

@observer
export class VNewsListScreen extends React.Component<IVNewsListScreenProps> {
  private _pr = IoC.get<VNewsListPresent>(VNewsListPresentTid);

  constructor(props: IVNewsListScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this._pr.init(this.props);
  }

  public render() {
    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Title text={'News Tab Screen'} />
        </VNavBar>
        <VContent footerTabs>
          {this.contentRender}
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    // if (isLoading) return <VStubLoading />;
    // if (isError) return <VStubError />;
    // if (isEmpty) return <VStubEmpty />;
    return <VText>News List Screen</VText>;
  }
}
