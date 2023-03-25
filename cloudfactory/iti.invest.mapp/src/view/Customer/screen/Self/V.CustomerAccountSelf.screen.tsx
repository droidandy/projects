import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import {
  IVCustomerAccountSelfPresentProps, VCustomerAccountSelfPresent, VCustomerAccountSelfPresentTid,
} from '@invest.wl/view/src/Customer/present/V.CustomerAccountSelf.present';
import { VAccountByAgreement } from '../../../Account/component/V.AccountByAgreement.component';
import { VStub, VCol, VContainer, VContent, VNavBar, VStatusBar } from '@invest.wl/mobile/src/view/kit';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VCustomerStatList } from '../../component/V.CustomerStatList.component';
import { mapScreenPropsToProps } from '@invest.wl/mobile/src/view/util/react.util';

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
        <VStatusBar translucent />
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
