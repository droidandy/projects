import React from 'react';
import { observer } from 'mobx-react';
import { computed, makeObservable } from 'mobx';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { IVButtonModelProps, IVFlexProps, VButton, VModalDialog } from '@invest.wl/mobile/src/view/kit';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { ToggleX } from '@invest.wl/common/src/reactive/ToggleX';
import { DCustomerAccountSelfCase, DCustomerAccountSelfCaseTid } from '@invest.wl/domain/src/Customer/case/D.CustomerAccountSelf.case';

export interface IVAuthSignoutButtonProps extends IVButtonModelProps, IVFlexProps {
}

@observer
export class VAuthSignoutButton extends React.Component<IVAuthSignoutButtonProps> {
  public cse = IoC.get<DCustomerAccountSelfCase>(DCustomerAccountSelfCaseTid);
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public toggler = new ToggleX();

  constructor(props: IVAuthSignoutButtonProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { space, color } = this.theme;

    return (
      <>
        <VButton.Stroke mv={space.lg} color={color.primary1}
          onPress={this.toggler.open} {...this.props}>Выйти</VButton.Stroke>
        {this._dialogRender}
      </>
    );
  }

  @computed
  private get _dialogRender() {
    const { space, color } = this.theme;

    return (
      <VModalDialog isVisible={this.toggler.isOpen} animationDuration={0} onClose={this.toggler.close}>
        <VModalDialog.Title pa={space.lg} text={'Выйти из приложения?'} />
        <VModalDialog.Text pa={space.lg} pt={0}
          text={'При следующем входе потребуется пройти аутентификацию по логину-паролю и заново установить ПИН-код/Touch ID/Face ID'} />
        <VModalDialog.Actions>
          <VButton.Fill flex radius={0} color={color.decorLight} colorText={color.primary1}
            leftBottomRadius={this.theme.kit.ModalDialog.sRadius?.md}
            onPress={this.toggler.close}>Отмена</VButton.Fill>
          <VButton.Fill flex radius={0} onPress={this.cse.signOut}
            rightBottomRadius={this.theme.kit.ModalDialog.sRadius?.md}
          >Подтвердить</VButton.Fill>
        </VModalDialog.Actions>
      </VModalDialog>
    );
  }
}
