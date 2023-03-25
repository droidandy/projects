import React, { useEffect } from 'react';
import { useNavigation } from '../../hooks/navigation';
import { mainRoute } from '../../configs/routeName';
import { Loader } from '../Loader/Loader';
import { DataContainer } from '../../containers/layouts/DataContainer/DataContainer';
import { useLogout } from '../../contexts/auth-context';

export const Logout: React.FC = () => {
  const logout = useLogout();
  const navigation = useNavigation();

  useEffect(() => {
    logout().catch(() => {
      navigation.navigate(mainRoute);
    });
  }, [logout, navigation]);

  return (
    <DataContainer
      key="container"
      scrollContentStyle={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Loader label="Выходим из системы" size="large" />
    </DataContainer>
  );
};
