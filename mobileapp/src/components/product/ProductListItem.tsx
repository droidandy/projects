import React from 'react';
import { ListProductFragment } from '../../apollo/requests';
import { ProductButtons } from './ProductButtons';
import { styles } from './ProductListItem.styles';
import { ProductItem } from './ProductItem';
import { TouchableOpacity, View } from 'react-native';
import { GiftToCartIcon } from '../../resources/svgs/gift-to-cart';
import { GiftInCartIcon } from '../../resources/svgs/gift-in-cart';

interface Props {
  product: ListProductFragment;
}

const ProductItemBase = ({ product }: Props) => {
  return (
    <ProductItem product={product}>
      <View key="buttons" style={styles.buttons}>
        <ProductButtons product={product} style={styles.button} />
      </View>
    </ProductItem>
  );
};

export const GiftProductItem = ({
  product,
  selected,
  select,
}: {
  product: ListProductFragment;
  selected: boolean;
  select: (id: number) => void;
}) => {
  return (
    <ProductItem product={product} giftSelection={true}>
      <View key="buttons" style={styles.buttons}>
        <AddGiftButton productId={product.id} selected={selected} select={select} />
      </View>
    </ProductItem>
  );
};

const AddGiftButton = ({
  productId,
  selected,
  select,
}: {
  productId: number;
  select: (id: number) => void;
  selected: boolean;
}) => {
  const handlePress = () => {
    select(productId);
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.buttonGift}>
      {selected ? <GiftInCartIcon /> : <GiftToCartIcon />}
    </TouchableOpacity>
  );
};

export const ProductListItem = React.memo<Props>(ProductItemBase);
