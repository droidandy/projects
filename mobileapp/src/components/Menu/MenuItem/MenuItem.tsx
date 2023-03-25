import { Text, TouchableHighlight, View } from 'react-native';
import * as React from 'react';
import { useNavigation } from '../../../hooks/navigation';
import { NavigationStackOptions } from 'react-navigation-stack';
import { menuItemStyles } from './MenuItem.styles';

export interface MenuItemProps extends NavigationStackOptions {
  title: string;
  path: string;
}

export const MenuItem: React.FC<Omit<MenuItemProps, 'isShowMenu'>> = (
  props: Omit<MenuItemProps, 'isShowMenu'>,
) => {
  const navigation = useNavigation();

  return (
    <>
      <TouchableHighlight
        key="touchable"
        underlayColor="transparent"
        activeOpacity={0.25}
        onPress={(): boolean => navigation.navigate(props.path)}
      >
        <View key="items" style={menuItemStyles.container}>
          <Text key="text" style={menuItemStyles.text}>
            {props.title}
          </Text>
        </View>
      </TouchableHighlight>
      <View style={menuItemStyles.line} />
    </>
  );
};
