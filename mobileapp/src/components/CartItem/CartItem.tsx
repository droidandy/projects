import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  CartItemWithProductFragment,
  EditCartAction,
  ProductInBasketFragment,
  ProductInBasketFragmentDoc,
  useUpdateCartMutation,
} from '../../apollo/requests';
import { Image } from '../Image/Image';
import { Counters } from '../Counters/Counters';
import { ProductItem } from '../product/ProductItem';
import { styles } from './CartItem.styles';
import IMAGES from '../../resources';

interface Props {
  cartItem: CartItemWithProductFragment;
}

const CartItemBase = ({ cartItem }: Props) => {
  const [doUpdateCart] = useUpdateCartMutation();
  const gift = cartItem.price === 0;
  return (
    <ProductItem product={cartItem.product} cartItem={cartItem}>
      {!gift ? (
        <View key="left" style={styles.actionAlign}>
          <Counters cartItem={cartItem} />
        </View>
      ) : null}
      <View key="right" style={styles.actionAlign}>
        <TouchableOpacity
          onPress={() => {
            doUpdateCart({
              variables: {
                productId: Number(cartItem.productId),
                editAction: EditCartAction.DeleteProduct,
              },
              update: (proxy, mutationResult) => {
                proxy.writeFragment<ProductInBasketFragment>({
                  fragment: ProductInBasketFragmentDoc,
                  id: `ProductModel:${cartItem.productId}`,
                  data: {
                    __typename: 'ProductModel',
                    isInBasket:
                      mutationResult.data?.updateCart.items.some(
                        x => x.productId === cartItem.productId,
                      ) || false,
                  },
                });
              },
            }).catch(console.error);
          }}
        >
          <Image key="remove" source={IMAGES.trash} />
        </TouchableOpacity>
      </View>
    </ProductItem>
  );
};

export const CartItemComp = React.memo<Props>(CartItemBase);
