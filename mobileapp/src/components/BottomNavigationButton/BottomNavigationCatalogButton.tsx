import React from 'react';
import { TouchableOpacity } from 'react-native';

import { BottomMenuIcons } from '../../configs/menu';
import {
  catalogRoute,
  categoryProductsRoute,
  childrenCategoriesRoute,
} from '../../configs/routeName';

import { useNavigation } from '../../hooks/navigation';

import { Image } from '../Image/Image';

import { styles } from './BottomNavigationButton.styles';

const catalogRouteLowCase = catalogRoute.toLowerCase();
const childrenCategoriesRouteLowCase = childrenCategoriesRoute.toLowerCase();
const categoryProductsRouteLowCase = categoryProductsRoute.toLowerCase();

interface BottomNavigationButtonProps {
  path: string;
  icons: BottomMenuIcons;
}

export const BottomNavigationCatalogButton: React.FC<BottomNavigationButtonProps> = ({
  path,
  icons,
}: BottomNavigationButtonProps) => {
  const navigation = useNavigation();
  const {
    state: { routeName },
  } = navigation;
  let isActiveRoute: boolean;

  switch (routeName.toLowerCase()) {
    case catalogRouteLowCase:
    case childrenCategoriesRouteLowCase:
    case categoryProductsRouteLowCase:
      isActiveRoute = true;
      break;
    default:
      isActiveRoute = false;
  }

  const handlePress = (): void => {
    if (!isActiveRoute) {
      navigation.navigate(path);
    }
  };

  return (
    <TouchableOpacity key="container" style={styles.button} onPress={handlePress}>
      <Image
        key="image"
        source={!isActiveRoute ? icons.default : icons.active}
        style={styles.image}
      />
    </TouchableOpacity>
  );
};
