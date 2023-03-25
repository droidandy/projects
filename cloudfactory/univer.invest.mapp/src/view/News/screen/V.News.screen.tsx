import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VContainer, VContent, VNavBar, VStatusBar, VText } from '@invest.wl/mobile/src/view/kit';
import {
  IVNewsPresentProps, VNewsPresent, VNewsPresentTid,
} from '@invest.wl/view/src/News/present/V.News.present';

export interface IVNewsScreenProps extends IVNewsPresentProps {
}

@observer
export class VNewsScreen extends React.Component<IVNewsScreenProps> {
  private _pr = IoC.get<VNewsPresent>(VNewsPresentTid);

  constructor(props: IVNewsScreenProps) {
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
          <VNavBar.Title text={'News Screen'} />
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
    return <VText>NewsScreen</VText>;
  }
}
