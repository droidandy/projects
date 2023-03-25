import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import ApolloClient from 'apollo-client';

import { AddPushTokenDocument } from '../apollo/requests';
import Constants from 'expo-constants';

export async function registerForPushNotificationsAsync(client: ApolloClient<any>): Promise<any> {
  if (!Constants.isDevice) return;
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  // Android получает права сразу после устаноки, а вот iOS может спросить пользователя только после
  // запуска
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Нет разрешения на отправку уведомлений');
    return;
  }

  // Получаем у expo токен, однозначно идентифицирующий текущее устройство
  return Notifications.getExpoPushTokenAsync()
    .then(token =>
      client.mutate({
        mutation: AddPushTokenDocument,
        variables: {
          token,
        },
        fetchPolicy: 'no-cache',
      }),
    )
    .catch(console.log);
}
