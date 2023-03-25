import React from 'react';
import { View } from 'react-native';
import { styles } from './BottomNavigation.styles';
import {
  BasketLinkSVGButton,
  SVGButton,
  FavouritesLinkSVGButton,
} from '../BottomNavigationButton/BottomNavigationButton';
import { ROUTES } from '../../configs/routeName';
import * as SVG from '../../resources/svgs';

export const BottomNavigation = () => {
  return (
    <View style={styles.container}>
      <SVGButton path={ROUTES.main} Icon={SVG.MainIcon} />
      <SVGButton path={ROUTES.pharmacy} Icon={SVG.PharmaciesIcon} />
      <BasketLinkSVGButton path={ROUTES.cartStepOne} />
      <FavouritesLinkSVGButton path={ROUTES.favourites} />
      <SVGButton path={ROUTES.menu} Icon={SVG.MenuIcon} />
    </View>
  );
};
