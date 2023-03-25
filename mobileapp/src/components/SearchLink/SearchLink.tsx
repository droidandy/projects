import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

import { searchRoute } from '../../configs/routeName';
import { useNavigation } from '../../hooks/navigation';
import { theme } from '../../helpers/theme';

import { Image } from '../Image/Image';
import IMAGES from '../../resources';

const SearchLinkBase: React.FC = () => {
  const navigation = useNavigation();
  const onPress = useCallback(() => navigation.navigate(searchRoute), [navigation]);

  return (
    <TouchableOpacity key="container" onPress={onPress} style={{ padding: theme.sizing(0.5) }}>
      <Image key="image" source={IMAGES.searchGreen} />
    </TouchableOpacity>
  );
};

export const SearchLink = React.memo<{}>(SearchLinkBase);
