import React from 'react';
import { View } from 'react-native';

import { settingsMenuConfig } from '../../configs/menu';

import { DataContainer } from '../layouts/DataContainer/DataContainer';

import { Menu } from '../../components/Menu/Menu';
import { UserCommonData } from '../../components/UserCommonData/UserCommonData';

import { styles } from './Settings.styles';

const SettingsBase: React.FC = () => {
  return (
    <DataContainer key="container">
      <UserCommonData key="user-common-data" showLocation />
      <View key="menu" style={styles.menu}>
        <Menu data={settingsMenuConfig} />
      </View>
    </DataContainer>
  );
};

export const Settings = React.memo<{}>(SettingsBase);
