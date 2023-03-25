import { Formatter } from '@invest.wl/common/src/util/formatter.util';
import { EDOwnerSubject, IoC } from '@invest.wl/core';
import { IVButtonSettingProps, VButton, VCol, VContainer, VContent, VNavBar, VSelect, VStatusBar, VText, VTouchable } from '@invest.wl/mobile';
import { IVOwnerInfoPresentProps, VOwnerInfoPresent, VOwnerInfoPresentTid } from '@invest.wl/view/src/Owner/present/V.OwnerInfo.present';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Linking } from 'react-native';

export interface IVOwnerInfoScreenProps extends IVOwnerInfoPresentProps {
}

@observer
export class VOwnerInfoScreen extends React.Component<IVOwnerInfoScreenProps> {
  private pr = IoC.get<VOwnerInfoPresent>(VOwnerInfoPresentTid);
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVOwnerInfoScreenProps) {
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
          <VNavBar.Title text={'Поддержка'} />
        </VNavBar>
        <VContent>
          {this.contentRender}
        </VContent>
      </VContainer>
    );
  }

  @computed
  private get contentRender() {
    const { model, subjectModel, subjectList } = this.pr;
    const { space, color } = this._theme;

    return (
      <>
        <VCol pa={space.lg}>
          <VText mb={space.md} font={'body4'}>Тема обращения</VText>
          <VSelect.Dropdown<EDOwnerSubject> title={'Тема обращения'} data={subjectList}
            onChange={subjectModel.domain.valueSet}
            selected={subjectModel.domain.value} />
          <VTouchable.Opacity onPress={this._email}>
            <VText mv={space.lg} font={'body9'}>E-mail: <VText color={color.muted4}>{model.emailHelp}</VText></VText>
          </VTouchable.Opacity>
        </VCol>
        {this._list.map((item, index) =>
          <VButton.Setting key={index} {...item} />,
        )}
        <VCol flex alignItems={'center'} justifyContent={'center'}>
          <VText color={color.muted4} font={'body19'}>или свяжитесь с нами по телефону {'\n'}</VText>
          <VText font={'title2'} color={color.primary1}>{model.domain.dto.phoneCallCenter}</VText>
        </VCol>
      </>
    );
  }

  private _email = () => {
    const { model } = this.pr;
    Linking.openURL('mailto:' + model.emailHelp).then();
  };

  private _phoneCall = () => {
    const { model } = this.pr;
    Linking.openURL(`tel:${Formatter.phoneSanitize(model.phone)}`).then();
  };

  private _list: IVButtonSettingProps[] = [
    { text: 'Написать в чат', icon: 'location' },
    { text: 'Позвонить нам', icon: 'iphone', onPress: this._phoneCall },
    { text: 'Заказать обратный звонок', icon: 'back-phone' },
  ];
}
