import React, { useEffect } from 'react';
import { StyleProp, Text, TextStyle, TouchableOpacity, View } from 'react-native';
import { getFullUrl, getImageUrl } from '../../../configs/environments';
import { useNavigation } from '../../../hooks/navigation';
import useDimensions from '../../../hooks/dimensions';
import { useGetProductQuery } from '../../../apollo/requests';
import { theme } from '../../../helpers/theme';
import { DataContainer } from '../../layouts/DataContainer/DataContainer';
import { DataChecker } from '../../../components/DataChecker/DataChecker';
import { Image } from '../../../components/Image/Image';
import { ProductButtons } from '../../../components/product/ProductButtons';
import { Description } from './Description';
import { styles } from './Product.styles';
import { removeTags } from '../../../helpers/string';
import IMAGES from '../../../resources';
import { DiscountLabel } from './discount-label';
import { usePhoto } from '../../../contexts/common-data-provider';
import { ProductLike } from '../../../components/buttons/ProductLike/ProductLike';
import { ShareButton } from '../../../components/buttons/share-btn';

export const Product = () => {
  const { setPhoto } = usePhoto();
  const dimensions = useDimensions();
  const navigation = useNavigation();
  const { id } = navigation.state.params!;
  const { data, loading, error, refetch } = useGetProductQuery({
    variables: { id: +id },
    notifyOnNetworkStatusChange: true,
    onCompleted: data1 => {
      navigation.setParams({ title: data1.product.name });
    },
  });

  const product = data?.product;

  if (loading || !product || error) {
    return (
      <DataChecker
        key="data-checker"
        loading={loading}
        data={product}
        error={error}
        loadingLabel="Загрузка информации о товаре"
        noDataLabel="Товар не найден"
        refetch={refetch}
      />
    );
  }

  const productQuantity = product.quantity || 0;
  const productOldPrice = product.oldPrice || 0;
  const inStock = productQuantity > 0;
  const showDiscount = productOldPrice > product.price || product.promotional;
  const showOldPrice = productOldPrice > 0 && productOldPrice > product.price;

  return (
    <DataContainer key="container" contentStyle={styles.content}>
      <View key="common" style={styles.common}>
        <TouchableOpacity
          key="image"
          style={{
            flexShrink: 0,
            width: dimensions.window.width / 3,
            height: dimensions.window.width / 3,
          }}
          onPress={() => setPhoto(getImageUrl(product.picture) || '')}
        >
          <Image
            source={{ uri: getImageUrl(product.picture) }}
            style={{
              width: dimensions.window.width / 3,
              height: dimensions.window.width / 3,
            }}
          />
          {showDiscount ? (
            <View
              key="discount"
              style={{
                position: 'absolute',
                zIndex: 10,
                marginTop: dimensions.window.width / 3 - theme.sizing(2),
              }}
            >
              <DiscountLabel product={product} />
            </View>
          ) : null}
          <View
            style={{
              position: 'absolute',
              zIndex: 10,
              margin: theme.sizing(-1),
            }}
          >
            <ProductLike product={product} />
          </View>
          {product.detailPageUrl ? (
            <ShareButton
              style={{ position: 'absolute', top: 30, zIndex: 10 }}
              title={product.name || undefined}
              url={getFullUrl(product.detailPageUrl)}
            />
          ) : null}
        </TouchableOpacity>
        <View key="right" style={styles.commonRight}>
          <View key="name">
            <Text style={styles.name}>{product.name}</Text>
          </View>
          {inStock ? (
            <View key="price" style={styles.price}>
              {showOldPrice ? (
                <View key="old" style={styles.priceOld}>
                  <Text key="text" style={styles.priceOldText}>
                    {product.oldPrice} руб.
                  </Text>
                </View>
              ) : null}
              <View key="current" style={styles.priceCurrent}>
                <Text
                  key="text"
                  style={showOldPrice ? styles.priceDiscountText : styles.priceCurrentText}
                >
                  {product.price} руб.
                </Text>
              </View>
            </View>
          ) : (
            <View key="out-of-stock" style={styles.outOfStock}>
              <Image key="icon" source={IMAGES.outOfStock} style={styles.outOfStockIcon} />
              <Text key="text" style={styles.outOfStockText}>
                Нет в наличии
              </Text>
            </View>
          )}
          <View key="buttons" style={styles.buttons}>
            <ProductButtons product={product} style={styles.button} />
          </View>
        </View>
      </View>
      {product.vendorCode ? (
        <View key="vendor-code" style={styles.vendorCode}>
          <Text style={styles.vendorCodeText}>Артикул: {product.vendorCode}</Text>
        </View>
      ) : null}
      <View key="expiration-date" style={[styles.vendorCode, { marginTop: theme.sizing(1) }]}>
        <Text style={styles.vendorCodeText}>
          Срок годности: <Text style={{ color: 'black' }}>{product.expirationDate}</Text>
        </Text>
      </View>
      <KeyValuePair
        key="receipt"
        title="Требуется рецепт"
        value={product.needReceipt ? 'да' : 'нет'}
      />
      <KeyValuePair
        key="active-ingredients"
        title="Действующие вещества"
        value={product.activeIngredients}
        style={styles.paramActiveIngredients}
      />
      <KeyValuePair key="form" title="Форма выпуска" value={product.form} />
      <KeyValuePair key="manufacturer" title="Производитель" value={product.manufacturer} />
      <Description key="description" description={product.description} />
    </DataContainer>
  );
};

type KVProps = {
  title: string;
  value?: string | null;
  style?: StyleProp<TextStyle>;
};

const KeyValuePair: React.FC<KVProps> = ({
  title,
  value,
  style = styles.paramValue,
}: KVProps): React.ReactElement | null => {
  if (!value) return null;
  const cleanValue = removeTags(value);
  if (!cleanValue) return null;
  return (
    <View style={styles.param}>
      <Text key="label" style={styles.paramLabel}>
        {title}:
      </Text>
      <Text key="value" style={style}>
        {cleanValue}
      </Text>
    </View>
  );
};
