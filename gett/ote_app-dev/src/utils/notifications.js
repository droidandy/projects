import firebase from 'react-native-firebase';
import { getCurrentRoute } from 'utils';

const BOOKING_STATUS_MESSAGE = 'booking_status_change';

const MAP_VIEW = 'MapView';

class PushNotification {
  launchAppByPush = false;

  registerFCMToken = () => firebase.messaging().getToken().then((token) => {
    if (token && this.token !== token) {
      this.token = token;

      return token;
    }

    return '';
  });

  getNotificationsPermissions = async () => {
    try {
      await firebase.messaging().requestPermission();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  addNotificationListener = ({ userToken, onOpen, navigation }) => {
    if (this.notificationListener) return;

    this.userToken = userToken;
    this.onOpen = onOpen;
    this.navigation = navigation;

    const importance = firebase.notifications.Android.Importance.Max;
    const channel = new firebase.notifications.Android.Channel('oteApp', 'Root Channel', importance);

    firebase.notifications().android.createChannel(channel);

    this.notificationListener = firebase.notifications().onNotification((notif) => {
      const notification = new firebase.notifications.Notification()
        .android.setChannelId('oteApp')
        .android.setSmallIcon('ic_notification')
        .android.setLargeIcon('ic_launcher')
        .android.setAutoCancel(true)
        .setNotificationId(notif.notificationId)
        .setTitle('Gett Business Solutions')
        .setBody(notif.body)
        .setData(notif.data)
        .setSound('default');

      firebase.notifications().displayNotification(notification);
    });

    this.messageListener = firebase.notifications().onNotificationOpened((message) => {
      this.onOpenFromTray(message?.notification?.data, false);
    });

    firebase.notifications().getInitialNotification().then((message) => {
      this.onOpenFromTray(message?.notification?.data, true);
    });
  };

  backToMap = () => {
    const currentRoute = getCurrentRoute(this.navigation);
    if (currentRoute.routeName !== MAP_VIEW) {
      const routes = this.navigation.dangerouslyGetParent().state.routes;
      this.navigation.goBack(routes[1]?.key);
    }
  };

  onOpenFromTray = (notif, isOpen) => {
    if (this.userToken && notif) {
      const status = notif.statusKind || notif.kind;

      if (notif.booking_id && status === BOOKING_STATUS_MESSAGE) {
        this.backToMap();
        this.launchAppByPush = isOpen;
        this.onOpen(notif.booking_id, { byPush: true });
      }
    }
  };

  clearNotificationListener = () => {
    if (this.notificationListener && this.messageListener && this.token && this.userToken) {
      this.token = '';
      this.userToken = '';
      this.navigation = '';
      this.notificationListener();
      this.messageListener();
    }
  };
}

export default new PushNotification();
