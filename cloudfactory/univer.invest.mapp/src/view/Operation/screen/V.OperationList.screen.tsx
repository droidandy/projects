import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VContainer, VContent, VNavBar, VStatusBar, VText } from '@invest.wl/mobile/src/view/kit';
import {
  IVOperationListPresentProps, VOperationListPresent, VOperationListPresentTid,
} from '@invest.wl/view/src/Operation/present/V.OperationList.present';

export interface IVOperationListScreenProps extends IVOperationListPresentProps {
}

@observer
export class VOperationListScreen extends React.Component<IVOperationListScreenProps> {
  private _pr = IoC.get<VOperationListPresent>(VOperationListPresentTid);

  constructor(props: IVOperationListScreenProps) {
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
          <VNavBar.Title text={'Operation Tab Screen'} />
        </VNavBar>
        <VContent>
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
    return <VText>Operation List Screen</VText>;
  }
}
