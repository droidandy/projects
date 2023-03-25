import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VContainer, VContent, VNavBar, VStatusBar, VStub, VText } from '@invest.wl/mobile/src/view/kit';
import {
  IVAccountListPresentProps, VAccountListPresent, VAccountListPresentTid,
} from '@invest.wl/view/src/Account/present/V.AccountList.present';

export interface IVAccountListScreenProps extends IVAccountListPresentProps {
}

@observer
export class VAccountListScreen extends React.Component<IVAccountListScreenProps> {
  private _pr = IoC.get<VAccountListPresent>(VAccountListPresentTid);

  constructor(props: IVAccountListScreenProps) {
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
          <VNavBar.Title text={'Account Tab Screen'} />
        </VNavBar>
        <VContent>
          <VStub mapXList={[this._pr.listX]}>
            {() => this.contentRender}
          </VStub>
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    return <VText>Account List Screen</VText>;
  }
}
