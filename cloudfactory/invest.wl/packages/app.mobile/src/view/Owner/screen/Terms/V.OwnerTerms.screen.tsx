import { IoC } from '@invest.wl/core';
import { mapScreenPropsToProps, VButton, VCollapsibleText, VContainer, VContent, VNavBar, VStatusBar } from '@invest.wl/mobile';
import { IVOwnerTermsPresentProps, VOwnerTermsPresent, VOwnerTermsPresentTid } from '@invest.wl/view/src/Owner/present/V.OwnerTerms.present';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVOwnerTermsScreenProps extends IVOwnerTermsPresentProps {
}

@mapScreenPropsToProps
@observer
export class VOwnerTermsScreen extends React.Component<IVOwnerTermsScreenProps> {
  private _pr = IoC.get<VOwnerTermsPresent>(VOwnerTermsPresentTid);
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public componentDidMount() {
    this._pr.init(this.props);
  }

  public render() {
    const { color, space } = this._theme;

    return (
      <VContainer>
        <VStatusBar />
        <VNavBar>
          <VNavBar.Back />
          <VNavBar.Title text={'Пользовательское соглашение'} />
        </VNavBar>
        <VContent pa={space.lg}>
          <VCollapsibleText isHyperlinked text={this._pr.text} collapsedLines={20} />
        </VContent>
        <VButton.Fill ma={space.lg} size={'lg'} color={color.accent1} onPress={this._pr.accept}>
          ПРИНИМАЮ УСЛОВИЯ
        </VButton.Fill>
      </VContainer>
    );
  }
}
