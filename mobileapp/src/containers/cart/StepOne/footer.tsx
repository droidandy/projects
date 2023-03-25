import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../helpers/theme';
import { useNavigation } from '../../../hooks/navigation';
import { getCashFormat } from '../../../helpers/numbers';
import { Button } from '../../../components/buttons/Button/Button';
import { cartStepTwoRoute } from '../../../configs/routeName';
import React from 'react';

const footerStyles = StyleSheet.create({
  amountPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    flexGrow: 1,
    flexShrink: 0,
    marginVertical: theme.sizing(1),
  },

  left: {
    marginHorizontal: theme.sizing(0.5),
  },
  right: {
    marginHorizontal: theme.sizing(0.5),
  },
  orderAmount: {
    fontSize: 16,
    color: theme.grayedGreen,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 16,
    color: theme.green,
    fontWeight: 'bold',
  },
  kvRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginVertical: 3,
  },
});
export const Footer = ({
  price,
  quantity,
  promoDiscount = 0,
  gifts = 0,
}: {
  price: number;
  quantity: number;
  promoDiscount?: number;
  gifts?: number;
}) => {
  const navigation = useNavigation();
  return (
    <View>
      <Text
        style={{
          fontSize: 29,
          color: '#707074',
          fontFamily: theme.fonts.productHeading,
          marginTop: theme.sizing(2),
          marginBottom: theme.sizing(1),
        }}
      >
        ИТОГО:
      </Text>
      <View key="total-products-count" style={footerStyles.kvRow}>
        <Text style={{ color: 'black', fontSize: 18 }}>Товаров:</Text>
        <Text style={{ fontSize: 18, fontFamily: theme.fonts.productHeading, color: 'black' }}>
          {quantity}
          {gifts ? ` + ${gifts}` : ''}
        </Text>
      </View>
      {promoDiscount > 0 ? (
        <View key="promo-discount" style={footerStyles.kvRow}>
          <Text style={{ color: 'black', fontSize: 18 }}>Скидка по промокоду:</Text>
          <Text style={{ fontSize: 18, fontFamily: theme.fonts.productHeading, color: 'red' }}>
            {getCashFormat(promoDiscount)} руб.
          </Text>
        </View>
      ) : null}
      <View key="total-price" style={footerStyles.kvRow}>
        <Text style={{ color: 'black', fontSize: 18 }}>На сумму:</Text>
        <Text style={{ fontSize: 18, color: theme.green, fontFamily: theme.fonts.productHeading }}>
          {getCashFormat(price)} руб.
        </Text>
      </View>
      <Button
        style={{ marginVertical: theme.sizing(2) }}
        key="confirm"
        onPress={() => navigation.navigate(cartStepTwoRoute, { price })}
        title="Выбрать аптеку получения"
      />
    </View>
  );
};
