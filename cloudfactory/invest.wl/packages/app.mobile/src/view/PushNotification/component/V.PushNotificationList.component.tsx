import { IoC } from '@invest.wl/core';
import { VCol } from '@invest.wl/mobile';
import { VNotificationListPresent, VNotificationListPresentTid } from '@invest.wl/view/src/Notification/present/V.NotificationList.present';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { VPushNotification } from './V.PushNotification.component';

interface Props {
  style?: ViewStyle;
}

@observer
export class VPushNotificationList extends React.Component<Props> {
  private _pr = IoC.get<VNotificationListPresent>(VNotificationListPresentTid);
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: Props) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get style(): StyleProp<ViewStyle> {
    return { top: this.theme.kit.StatusBar.sHeight?.md };
  }

  public render() {
    return (
      <VCol absolute ph={this.theme.space.md} style={[this.style, this.props.style]}>
        {this._pr.importantListX.list.map((m) => <VPushNotification model={m} key={m.id} />)}
      </VCol>
    );
  }
}
