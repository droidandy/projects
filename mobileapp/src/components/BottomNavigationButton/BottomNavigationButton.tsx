import React, { PropsWithChildren } from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { useNavigation } from '../../hooks/navigation';
import { styles } from './BottomNavigationButton.styles';
import {
  useCartProductsCount,
  useFavouritesCount,
  useNotificationsCount,
} from '../../contexts/common-data-provider';
import { Badge } from '../BasketLink/Badge';
import { theme } from '../../helpers/theme';
import { SVGIconComponent } from '../../resources/svgs/types';
import { CartIcon, FavouritesIcon, NotificationsIcon } from '../../resources/svgs';
import { ROUTES } from '../../configs/routeName';

export type BottomNavSVGButtonProps = PropsWithChildren<{
  path: string;
  Icon: SVGIconComponent;
  style?: StyleProp<ViewStyle>;
}>;

const touchInsets = { top: 20, left: 20, right: 20, bottom: 20 };

export const SVGButton = ({ path, Icon, children, style }: BottomNavSVGButtonProps) => {
  const navigation = useNavigation();
  const {
    state: { routeName },
  } = navigation;
  const routeNameLowerCase = routeName.toLowerCase();
  const isActiveRoute = routeNameLowerCase === path.toLowerCase();

  const handlePress = () => {
    if (!isActiveRoute) {
      navigation.navigate(path);
    }
  };

  return (
    <TouchableOpacity
      key="container"
      style={[styles.button, style]}
      onPress={handlePress}
      hitSlop={touchInsets}
    >
      <Icon active={isActiveRoute} />
      {children}
    </TouchableOpacity>
  );
};

export const NotificationsSVGButton = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const notificationsCount = useNotificationsCount();
  return (
    <SVGButton path={ROUTES.notifications} Icon={NotificationsIcon} style={style}>
      <Badge count={notificationsCount} position="right" style={{ backgroundColor: theme.red }} />
    </SVGButton>
  );
};

export const BasketLinkSVGButton = ({ path }: { path: string }) => {
  const productsCount = useCartProductsCount();
  return (
    <SVGButton path={path} Icon={CartIcon}>
      <Badge count={productsCount} position="right" style={{ backgroundColor: theme.red }} />
    </SVGButton>
  );
};

export const FavouritesLinkSVGButton = ({ path }: { path: string }) => {
  const count = useFavouritesCount();
  return (
    <SVGButton path={path} Icon={FavouritesIcon}>
      <Badge count={count} position="right" style={{ backgroundColor: theme.green }} />
    </SVGButton>
  );
};
