import { IoC } from '@invest.wl/core';
import { mapScreenPropsToProps, VCol, VContainer, VContent, VNavBar, VStatusBar, VStub } from '@invest.wl/mobile';
import {
  IVCustomerAccountSelfPresentProps,
  VCustomerAccountSelfPresent,
  VCustomerAccountSelfPresentTid,
} from '@invest.wl/view/src/Customer/present/V.CustomerAccountSelf.present';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VAccountByAgreement } from '../../../Account/component/V.AccountByAgreement.component';
import { VCustomerStatList } from '../../component/V.CustomerStatList.component';

export interface IVCustomerAccountSelfScreenProps extends IVCustomerAccountSelfPresentProps {
}

@mapScreenPropsToProps
@observer
export class VCustomerAccountSelfScreen extends React.Component<IVCustomerAccountSelfScreenProps> {
  private pr = IoC.get<VCustomerAccountSelfPresent>(VCustomerAccountSelfPresentTid);
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVCustomerAccountSelfScreenProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    this.pr.init(this.props);
  }

  public render() {
    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Профиль пользователя'} />
        </VNavBar>
        <VContent footerTabs>
          <VStub mapXList={[this.pr.selfX]}>
            {() => this.contentRender}
          </VStub>
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    const { selfX, agreementListX } = this.pr;
    const { space } = this._theme;

    return (
      <VCol flex margin={space.lg}>
        <VCustomerStatList model={selfX.model!} mb={space.lg} />
        {agreementListX.list.map((model, index) => (
          <VAccountByAgreement key={model.id} mt={!!index ? space.lg : undefined} model={model} />
        ))}
      </VCol>
    );
  }
}
