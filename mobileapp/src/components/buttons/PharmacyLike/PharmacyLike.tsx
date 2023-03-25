import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { ListPharmacyFragment } from '../../../apollo/requests';
import { Image } from '../../Image/Image';
import { styles } from './PharmacyLike.styles';
import { useUpdatePharmacyFavorite } from '../../../hooks/cache';
import IMAGES from '../../../resources';

interface Props {
  pharmacy: ListPharmacyFragment;
}

const PharmacyLikeBase = ({ pharmacy }: Props) => {
  const [update, updating] = useUpdatePharmacyFavorite();
  const onPress = useCallback(() => {
    update(pharmacy.id, !pharmacy.isFavourite);
  }, [pharmacy.id, pharmacy.isFavourite, update]);

  return (
    <TouchableOpacity
      key="like-button"
      onPress={onPress}
      style={styles.container}
      disabled={updating}
    >
      <Image key="icon" source={pharmacy.isFavourite ? IMAGES.heartFilled : IMAGES.heart} />
    </TouchableOpacity>
  );
};

export const PharmacyLike = React.memo<Props>(PharmacyLikeBase);
