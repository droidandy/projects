import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import { cartStepOneRoute } from '../../configs/routeName';
import { useNavigation } from '../../hooks/navigation';
import { Image } from '../Image/Image';
import { useCartProductsCount } from '../../contexts/common-data-provider';
import IMAGES from '../../resources';
import { theme } from '../../helpers/theme';
import { Badge } from './Badge';

const BasketLinkBase = ({ style }: { style?: StyleProp<ViewStyle> }) => {
  const productsCount = useCartProductsCount();
  const { navigate } = useNavigation();

  const onPress = () => navigate(cartStepOneRoute);

  return (
    <TouchableOpacity key="container" onPress={onPress} style={style}>
      <Image key="image" source={IMAGES.basket} />
      <Badge count={productsCount} position="right" style={{ backgroundColor: theme.red }} />
    </TouchableOpacity>
  );
};

export const BasketLink = React.memo(BasketLinkBase);
