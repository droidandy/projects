import React, { useEffect, useReducer, useState } from 'react';

import {
  useGetNotificationSettingsQuery,
  useUpdateNotificationsSettingsMutation,
} from '../../apollo/requests';
import { useNavigation } from '../../hooks/navigation';

import { DataContainer } from '../layouts/DataContainer/DataContainer';

import { Button } from '../../components/buttons/Button/Button';
import { Switcher } from '../../components/inputs/Switcher/Switcher';
import { SeparatorLine } from '../../components/SeparatorLine/SeparatorLine';
import { UserCommonData } from '../../components/UserCommonData/UserCommonData';
import { DataChecker } from '../../components/DataChecker/DataChecker';

import { initialState, reducer } from './SettingsNotifications.reducer';
import { styles } from './SettingsNotifications.styles';

const SettingsNotificationsBase: React.FC = () => {
  const navigation = useNavigation();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { data, loading, error, refetch } = useGetNotificationSettingsQuery();
  const [doUpdateNotificationsSettings] = useUpdateNotificationsSettingsMutation();

  useEffect(() => {
    if (data && !state.initialized) {
      const { status, stocks } = data.notification;
      dispatch({
        type: 'Init',
        payload: {
          status,
          stocks,
        },
      });
    }
  }, [data, state.initialized]);

  return (
    <DataChecker
      key="data-checker"
      loading={loading}
      data={data?.notification}
      error={error}
      loadingLabel="Загрузка настроек уведомлений"
      noDataLabel="Не удалось загрузить настройки уведомлений"
      refetch={refetch}
    >
      <DataContainer
        key="container"
        contentStyle={styles.content}
        footerTopAdornment={
          <Button
            title="Сохранить изменения"
            style={styles.bottomButton}
            disabled={isSaving}
            loading={isSaving}
            onPress={(): void => {
              const variables = {
                status: state.status,
                stocks: state.stocks,
              };
              setIsSaving(true);
              doUpdateNotificationsSettings({
                variables,
              })
                .then(() => {
                  navigation.goBack();
                })
                .catch(() => setIsSaving(false));
            }}
          />
        }
      >
        <UserCommonData key="user-common-data" />
        <Switcher
          key="order"
          value={state.status}
          style={styles.switcher}
          onValueChange={(newValue): void => dispatch({ type: 'status', payload: newValue })}
        >
          Статусы заказов
        </Switcher>
        <SeparatorLine key="separator-order" style={styles.separators} />
        <Switcher
          key="stock"
          value={state.stocks}
          style={styles.switcher}
          onValueChange={(newValue): void => dispatch({ type: 'stocks', payload: newValue })}
        >
          Акции
        </Switcher>
        <SeparatorLine key="separator-stock" style={styles.separators} />
      </DataContainer>
    </DataChecker>
  );
};

export const SettingsNotifications = React.memo<{}>(SettingsNotificationsBase);
