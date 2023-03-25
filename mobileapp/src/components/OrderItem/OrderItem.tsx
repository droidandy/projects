import React from 'react';
import { ListRenderItem, Text } from 'react-native';
import { CartItemWithProductFragment } from '../../apollo/requests';
import { styles } from './OrderItem.styles';
import { ProductItem } from '../product/ProductItem';

interface Props {
  cartItem: CartItemWithProductFragment;
}

const OrderItemBase = ({ cartItem: item }: Props) => {
  return (
    <ProductItem product={item.product}>
      <Text style={styles.quantity}>x {item.quantity} шт.</Text>
    </ProductItem>
  );
};

export const OrderProductItem = React.memo<Props>(OrderItemBase);

export const OrderProductRenderItem: ListRenderItem<CartItemWithProductFragment> = info => (
  <OrderProductItem cartItem={info.item} />
);
