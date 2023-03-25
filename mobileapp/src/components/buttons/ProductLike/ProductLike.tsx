import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { ListProductFragment } from '../../../apollo/requests';
import { Image } from '../../Image/Image';
import { styles } from './ProductLike.styles';
import { useUpdateProductFavorite } from '../../../hooks/cache';
import IMAGES from '../../../resources';

interface Props {
  product: ListProductFragment;
}

const insets = { top: 10, right: 10, bottom: 10, left: 10 };

const ProductLikeBase = ({ product }: Props) => {
  const [update, updating] = useUpdateProductFavorite();

  const edit = useCallback(() => {
    update(product, !product.isFavourite);
  }, [product, update]);

  return (
    <TouchableOpacity
      key="like-button"
      onPress={edit}
      style={styles.container}
      disabled={updating}
      hitSlop={insets}
    >
      <Image key="icon" source={product.isFavourite ? IMAGES.heartFilled : IMAGES.heart} />
    </TouchableOpacity>
  );
};

export const ProductLike = React.memo(ProductLikeBase);
