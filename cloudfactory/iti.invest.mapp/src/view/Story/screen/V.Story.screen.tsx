import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VContainer, VContent, VNavBar, VStatusBar, VText } from '@invest.wl/mobile/src/view/kit';
import { IVStoryPresentProps, VStoryPresent, VStoryPresentTid } from '@invest.wl/view/src/Story/present/V.Story.present';

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
        <VStatusBar translucent />
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
