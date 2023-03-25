import React from 'react';
import { View } from 'react-native';

import { mainMenuConfig } from '../../configs/menu';

import { DataContainer } from '../layouts/DataContainer/DataContainer';

import { Menu } from '../../components/Menu/Menu';
import { UserCommonData } from '../../components/UserCommonData/UserCommonData';

import { styles } from './MainMenu.styles';

export const MainMenu: React.FC = () => {
  return (
    <DataContainer key="container">
      <UserCommonData key="user-common-data" showLocation={true} />
      <View key="menu" style={styles.menu}>
        <Menu data={mainMenuConfig} />
      </View>
    </DataContainer>
  );
};
