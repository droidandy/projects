import { IoC } from '@invest.wl/core';
import { VContainer, VContent, VNavBar, VStatusBar, VText } from '@invest.wl/mobile';
import { IVStoryPresentProps, VStoryPresent, VStoryPresentTid } from '@invest.wl/view/src/Story/present/V.Story.present';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVStoryScreenProps extends IVStoryPresentProps {
}

@observer
export class VStoryScreen extends React.Component<IVStoryScreenProps> {
  private _pr = IoC.get<VStoryPresent>(VStoryPresentTid);

  constructor(props: IVStoryScreenProps) {
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
          <VNavBar.Title text={'Story Screen'} />
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
    return <VText>StoryScreen</VText>;
  }
}
