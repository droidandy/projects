import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { getImageUrl } from '../../configs/environments';
import { productRoute } from '../../configs/routeName';
import { CartItemWithProductFragment, ListProductFragment } from '../../apollo/requests';
import { useNavigation } from '../../hooks/navigation';
import { Image } from '../Image/Image';
import { styles } from './ProductItem.styles';
import { ProductLike } from '../buttons/ProductLike/ProductLike';
import { getCashFormat } from '../../helpers/numbers';
import IMAGES from '../../resources';
import { DiscountLabel } from '../../containers/catalog/Product/discount-label';

interface Props {
  product: ListProductFragment;
  children: React.ReactNode;
  /**
   * Если рисуется из корзины
   */
  cartItem?: CartItemWithProductFragment;
  /**
   * Если рисуется из окна выбора подарков :(
   */
  giftSelection?: boolean;
}

const notAvailable = (
  <View key="out-of-stock" style={styles.outOfStock}>
    <Image key="icon" source={IMAGES.outOfStock} style={styles.outOfStockIcon} />
    <Text key="text" style={styles.outOfStockText}>
      Нет в наличии
    </Text>
  </View>
);

const Price = ({ price, oldPrice }: { price?: number | null; oldPrice?: number | null }) => {
  const showOldPrice =
    typeof price === 'number' && typeof oldPrice === 'number' && oldPrice > 0 && oldPrice > price;
  return (
    <View key="price" style={styles.price}>
      {showOldPrice ? (
        <View key="old" style={styles.priceOld}>
          <Text key="text" style={styles.priceOldText}>
            {getCashFormat(oldPrice || 0)} руб.
          </Text>
        </View>
      ) : null}
      <View key="current" style={styles.priceCurrent}>
        <Text key="text" style={showOldPrice ? styles.priceDiscountText : styles.priceCurrentText}>
          {getCashFormat(price || 0)} руб.
        </Text>
      </View>
    </View>
  );
};

export const ProductItem = ({ product, children, cartItem, giftSelection }: Props) => {
  const gift = (cartItem && cartItem.price === 0) || giftSelection;
  const { navigate } = useNavigation();

  const inStock = !!product.quantity;
  const uri = getImageUrl(product.preview ? product.preview : product.picture);
  const showDiscount = product.oldPrice > product.price || product.promotional;

  const onPress = !gift
    ? () => navigate(productRoute, { id: product.id, title: product.name })
    : undefined;

  let price = !!cartItem ? cartItem.price : product.price;
  let oldPrice = !!cartItem ? cartItem.oldPrice : product.oldPrice;
  if (giftSelection) {
    price = 0;
    oldPrice = product.price;
  }
  return (
    <TouchableOpacity
      key="container"
      style={styles.container}
      onPress={onPress}
      activeOpacity={gift ? 1 : 0.25}
      // onPress={() =>
      //   Linking.openURL(Linking.makeUrl(`/product/${product.id}`, { title: `${product.name}` }))
      // }
    >
      <View key="right" style={styles.right}>
        {!gift ? (
          <View key="like" style={styles.like}>
            <ProductLike product={product} />
          </View>
        ) : null}
        <View key="image" style={styles.image}>
          <Image
            key="product-image"
            source={{ uri }}
            style={styles.productImage}
            resizeMode="contain"
          />
        </View>
        {showDiscount ? (
          <View key="discount" style={styles.discountTag}>
            <DiscountLabel product={product} />
          </View>
        ) : null}
      </View>

      <View key="left" style={styles.left}>
        <Text key="text" style={styles.nameText} numberOfLines={2}>
          {product.name}
        </Text>
        {inStock ? <Price price={price} oldPrice={oldPrice} /> : notAvailable}
        {children}
      </View>
    </TouchableOpacity>
  );
};
