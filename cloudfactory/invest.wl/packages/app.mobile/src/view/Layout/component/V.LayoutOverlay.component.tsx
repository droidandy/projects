import { VModalPortal } from '@invest.wl/mobile';
import React from 'react';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { VNotificationList } from '../../Notification/component/V.NotificationList.component';

export class VLayoutOverlay extends React.Component {
  public render() {
    return (
      <SafeAreaInsetsContext.Consumer>{(insets) => (
        <>
          {/* Чтобы не было наслаивания нотификаций если открыто модальное окно */}
          {/* нужно прятать это */}
          {/* <VPushNotificationList /> */}
          <VNotificationList pt={insets?.top} />
          {/* TODO: управление отображения модальными окнами */}
          <VModalPortal.Host />
        </>
      )}</SafeAreaInsetsContext.Consumer>
    );
  }
}
