import { ListProductFragment, ProductDataFragment } from '../../../apollo/requests';
import IMAGES from '../../../resources';
import { Image } from '../../../components/Image/Image';
import { Text } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import React from 'react';

export const DiscountLabel = ({
  product,
}: {
  product: ProductDataFragment | ListProductFragment;
}) => {
  const discountPercent = Math.floor((1 - product.price / product.oldPrice) * 100);
  let showDiscountText = discountPercent >= 1;

  let discountImage = IMAGES.discount;
  if (discountPercent >= 1) {
    discountImage = IMAGES.discountEmpty;
  } else if (discountPercent > 0) {
    discountImage = IMAGES.discount;
  } else if (product.promotional) {
    discountImage = IMAGES.sale;
  }

  // gifts
  if (product.price === 0) {
    showDiscountText = false;
    discountImage = IMAGES.sale;
  }

  return (
    <>
      <Image key="discount" source={discountImage} />
      {showDiscountText ? (
        <Text
          key="discount-value"
          style={{
            fontSize: 12,
            textAlign: 'center',
            top: 8,
            left: 5,
            right: 10,
            position: 'absolute',
            zIndex: 11,
            color: Colors.white,
          }}
        >
          - {discountPercent}%
        </Text>
      ) : null}
    </>
  );
};
