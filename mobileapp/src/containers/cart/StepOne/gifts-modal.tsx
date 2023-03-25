import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../helpers/theme';
import { GiftIcon } from '../../../resources/svgs/gift';
import React, { useState } from 'react';
import { GiftProductItem } from '../../../components/product/ProductListItem';
import { SeparatorDash } from '../../../components/SeparatorDash/SeparatorDash';
import {
  GetCartWithProductsDocument,
  ListProductFragment,
  ProductInBasketFragmentDoc,
  useAddToCartMutation,
} from '../../../apollo/requests';
import { Button } from '../../../components/buttons/Button/Button';
import { InnerShadow } from '../../../components/inner-shadow';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  products: {
    display: 'flex',
    flex: 1,
    paddingVertical: theme.screenPadding.vertical,
    marginHorizontal: theme.screenPadding.horizontal,
  },
  header: {
    flexDirection: 'row',
    height: 57,
    backgroundColor: theme.green,
    paddingVertical: -1 * theme.sizing(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 20,
  },
  discountLinks: {
    marginHorizontal: theme.sizing(2),
    display: 'flex',
    alignItems: 'flex-start',
  },
  linkText: {
    color: theme.green,
    textDecorationLine: 'underline',
    fontFamily: theme.fonts.productHeading,
    fontSize: 18,
    marginVertical: 11,
  },
});

export const GiftsModal = ({
  visible,
  close,
  gifts,
}: {
  visible: boolean;
  close: () => void;
  gifts: ListProductFragment[];
}) => {
  const [selected, setSelected] = useState<number | null>(null);
  const [addToCart, { loading }] = useAddToCartMutation({
    refetchQueries: [{ query: GetCartWithProductsDocument }],
    update: (proxy, mutationResult) => {
      if (mutationResult.data?.updateCart.items.some(x => x.productId === selected)) {
        proxy.writeFragment({
          id: `ProductModel:${selected}`,
          fragment: ProductInBasketFragmentDoc,
          data: { isInBasket: true, __typename: 'ProductModel' },
        });
      }
    },
  });
  const handleConfirm = async () => {
    if (selected === null) return;
    await addToCart({ variables: { productId: selected, quantity: 1 } });
    setSelected(null);
    close();
  };

  const handleClose = () => {
    setSelected(null);
    close();
  };

  return (
    <Modal visible={visible} presentationStyle={'overFullScreen'} animationType="slide">
      <SafeAreaView style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <View style={styles.header}>
          <GiftIcon style={{ marginRight: theme.sizing(1) }} />
          <Text style={styles.headerText}>Доступные подарки</Text>
        </View>
        <View style={{ flex: 1 }}>
          <ScrollView>
            <View style={styles.products}>
              {gifts?.map(x => (
                <React.Fragment key={x.id}>
                  <GiftProductItem product={x} selected={x.id === selected} select={setSelected} />
                  <SeparatorDash />
                </React.Fragment>
              ))}
            </View>
          </ScrollView>
          <InnerShadow />
        </View>
        <View
          style={{
            paddingVertical: theme.sizing(2),
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <Button type={'outlined'} title="Отменить" onPress={handleClose} />
          <Button
            disabled={selected === null}
            loading={loading}
            startAdornment={
              <GiftIcon width={16} height={16} style={{ marginRight: theme.sizing(1) }} />
            }
            title="Применить"
            onPress={handleConfirm}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
