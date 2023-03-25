import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import {
  ListProductFragment,
  ProductInBasketFragmentDoc,
  useAddToCartMutation,
  useGetCartQuery,
} from '../../apollo/requests';
import { Button } from '../buttons/Button/Button';
import { Counters } from '../Counters/Counters';
import { NotifyButton } from '../../resources/svgs/notify';

interface Props {
  product: ListProductFragment;
  style?: StyleProp<ViewStyle>;
}

const ProductButtonsBase = ({ product, style }: Props) => {
  const { quantity = 0, isInBasket } = product;

  const [addToCart, { loading }] = useAddToCartMutation({
    variables: { productId: product.id, quantity: 1 },
    update: (proxy, mutationResult) => {
      if (mutationResult.data?.updateCart.items.some(x => x.productId === product.id)) {
        proxy.writeFragment({
          id: `ProductModel:${product.id}`,
          fragment: ProductInBasketFragmentDoc,
          data: { isInBasket: true, __typename: 'ProductModel' },
        });
      }
    },
  });

  if (quantity > 0 && !isInBasket) {
    return (
      <Button
        key="add-to-basket"
        title="В КОРЗИНУ"
        style={style}
        onPress={() => addToCart()}
        loading={loading}
      />
    );
  }

  if (quantity > 0) {
    return <ProductCounters id={product.id} />;
  }

  if (quantity === 0) {
    return <NotifyButton product={product} style={style} />;
  }
  return null;
};

const ProductCounters = ({ id }: { id: number }) => {
  const { data, loading } = useGetCartQuery({ fetchPolicy: 'cache-first' });
  if (loading || !data) return null;
  const cartItem = data.cart.items.find(x => x.productId === id);
  return !!cartItem ? <Counters cartItem={cartItem} /> : null;
};

export const ProductButtons = React.memo<Props>(ProductButtonsBase);
