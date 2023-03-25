import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { styles } from './HeaderRight.styles';
import { NotificationsSVGButton } from '../BottomNavigationButton/BottomNavigationButton';
import { StatusBar } from 'expo-status-bar';

interface Props {
  hideSearch?: boolean;
  hideBasket?: boolean;
  style?: StyleProp<ViewStyle>;
}

const HeaderRightBase = ({ hideSearch, hideBasket, style }: Props) => {
  return (
    <View key="container" style={[styles.container, style]}>
      <StatusBar translucent style="auto" />
      {/*{hideSearch ? null : <SearchLink key="search-link" />}*/}
      {/*{hideBasket ? null : <BasketLink key="basket-link" />}*/}
      <NotificationsSVGButton />
    </View>
  );
};

export const HeaderRight = React.memo<Props>(HeaderRightBase);
