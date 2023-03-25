import { EDOwnerContactType, IoC } from '@invest.wl/core';
import { VCard, VCol, VContainer, VContent, VIcon, VNavBar, VRow, VStatusBar, VTouchable } from '@invest.wl/mobile';
import { IVOwnerModelStat } from '@invest.wl/view/src/Owner/model/V.Owner.model';
import { IVOwnerContactPresentProps, VOwnerContactPresent, VOwnerContactPresentTid } from '@invest.wl/view/src/Owner/present/V.OwnerContact.present';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Linking } from 'react-native';
import { VCustomerStat } from '../../../Customer/component/V.CustomerStat.component';

export interface IVOwnerContactScreenProps extends IVOwnerContactPresentProps {
}

@observer
export class VOwnerContactScreen extends React.Component<IVOwnerContactScreenProps> {
  private pr = IoC.get<VOwnerContactPresent>(VOwnerContactPresentTid);
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVOwnerContactScreenProps) {
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
          <VNavBar.Title text={'Контакты'} />
        </VNavBar>
        <VContent>
          {this.contentRender}
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    const { space, color } = this._theme;

    return (
      <>
        <VCol flex margin={space.lg}>
          {this.pr.model.statList.map((item, index) => (
            <VCard key={item.name} pa={space.lg} mt={!!index ? space.lg : undefined}>
              <VTouchable.Opacity context={item} onPress={this._linking} onLongPress={this._clipboard}>
                <VRow justifyContent={'space-between'} alignItems={'center'}>
                  <VCustomerStat {...item} />
                  {item.type != null &&
                  <VIcon color={color.muted3} name={'arrow-dropdown'} fontSize={18} rotate={'-90deg'} />}
                </VRow>
              </VTouchable.Opacity>
            </VCard>
          ))}
        </VCol>
      </>
    );
  }

  private _linking = (item: IVOwnerModelStat) => {
    if (item.type != null) Linking.openURL(`${item.type === EDOwnerContactType.Email ? 'mailto' : 'tel'}:${item.value}`).then();
  };
  private _clipboard = (item: IVOwnerModelStat) => this.pr.clipboardSet(item.value);
}
