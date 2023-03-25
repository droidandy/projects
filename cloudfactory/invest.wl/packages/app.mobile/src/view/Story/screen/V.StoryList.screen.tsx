import { IoC } from '@invest.wl/core';
import { VContainer, VContent, VNavBar, VStatusBar, VText } from '@invest.wl/mobile';
import { IVStoryListPresentProps, VStoryListPresent, VStoryListPresentTid } from '@invest.wl/view/src/Story/present/V.StoryList.present';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVStoryListScreenProps extends IVStoryListPresentProps { }

@observer
export class VStoryListScreen extends React.Component<IVStoryListScreenProps> {
  private _pr = IoC.get<VStoryListPresent>(VStoryListPresentTid);

  constructor(props: IVStoryListScreenProps) {
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
          <VNavBar.Title text={'Story Tab Screen'} />
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
    return <VText>Story List Screen</VText>;
  }
}
