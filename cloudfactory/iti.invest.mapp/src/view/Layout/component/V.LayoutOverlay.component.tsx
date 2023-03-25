import React from 'react';
import { VNotificationList } from '../../Notification/component/V.NotificationList.component';
// import { VModalHost } from '@invest.wl/mobile/src/view/kit';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

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
          {/*<VModalHost />*/}
        </>
      )}</SafeAreaInsetsContext.Consumer>
    );
  }
}
