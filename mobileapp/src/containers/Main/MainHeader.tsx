import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity, View } from 'react-native';
import { useNavigation } from '../../hooks/navigation';
import { useTextLimit } from '../../hooks/textLimit';
import { InputSquared } from '../../components/inputs/InputSquared/InputSquared';
import { Image } from '../../components/Image/Image';
import { Link } from '../../components/buttons/Link/Link';
import { headerStyles as styles } from './Main.styles';
import { searchRoute } from '../../configs/routeName';
import { useCity } from '../../contexts/common-data-provider';
import IMAGES from '../../resources';
import { BasketLink } from '../../components/BasketLink/BasketLink';
import { theme } from '../../helpers/theme';
import { NotificationsSVGButton } from '../../components/BottomNavigationButton/BottomNavigationButton';

const breakpoints = {
  xs: 10,
  sm: 12,
  md: 15,
  lg: 40,
  xl: 60,
};

export const MainHeader = () => {
  const city = useCity();
  const navigation = useNavigation();
  const location = useTextLimit(city.name ? city.name : 'Местоположение', breakpoints);

  return (
    <View key="header" style={styles.header}>

      <View style={styles.top}>
        <InputSquared
          key="input"
          placeholder="Найти препарат"
          value=""
          onTouchStart={() => navigation.navigate(searchRoute)}
          startAdornment={
            <TouchableOpacity key="touchableOpacityIcon">
              <Image key="icon" source={IMAGES.searchGray} style={styles.headerInputIcon} />
            </TouchableOpacity>
          }
          onFocus={() => navigation.navigate(searchRoute)}
        />
        <NotificationsSVGButton style={{ marginLeft: theme.sizing(1) }} />
        {/*<BasketLink key="basket-link" style={{ marginLeft: theme.sizing(1) }} />*/}
      </View>
      <View key="links" style={styles.headerLinks}>
        <Link
          key="link-catalog"
          title="Каталог"
          link="Catalog"
          underline="none"
          style={styles.headerLink}
          textStyle={styles.headerLinkText}
          startAdornment={
            <Image key="icon" source={IMAGES.catalogGreen} style={styles.headerLinkIcon} />
          }
        />
        <Link
          key="link-location"
          title={location}
          link="LocationChange"
          underline="none"
          style={styles.headerLink}
          textStyle={styles.headerLinkText}
          startAdornment={
            <Image key="icon-loc" source={IMAGES.locationGreen} style={styles.headerLinkLocIcon} />
          }
          endAdornment={
            <Image
              key="icon-chevron"
              source={IMAGES.chevronDownGreen}
              style={styles.headerLinkChevronIcon}
            />
          }
        />
      </View>
      <StatusBar translucent style="auto" />
    </View>
  );
};
