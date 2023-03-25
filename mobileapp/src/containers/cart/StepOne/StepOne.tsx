import React, { useCallback, useMemo, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useGetCartWithProductsQuery } from '../../../apollo/requests';
import { SeparatorDash } from '../../../components/SeparatorDash/SeparatorDash';
import { DataChecker } from '../../../components/DataChecker/DataChecker';
import { CartItemComp } from '../../../components/CartItem/CartItem';
import { Button } from '../../../components/buttons/Button/Button';

import { theme } from '../../../helpers/theme';
import { DataContainer } from '../../layouts/DataContainer/DataContainer';
import { GiftIcon } from '../../../resources/svgs/gift';
import { ModalBonusPoints } from './bonus-points-modal';
import { ModalPromoCode } from './promo-code-modal';
import { GiftsModal } from './gifts-modal';
import { PromoCodeIcon } from '../../../resources/svgs/promo-code';
import { Footer } from './footer';
import { Coupon } from './coupon';

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
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: theme.sizing(2),
  },
  headerText: {
    // color: 'white',
    color: 'black',
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

const StepOneBase = () => {
  const [bonusModalVisible, setBonusModalVisible] = useState(false);
  const [promoModalVisible, setPromoModalVisible] = useState(false);
  const [giftsModalVisible, setGiftsModalVisible] = useState(false);
  const closeBonusModal = useCallback(() => {
    setBonusModalVisible(false);
  }, []);
  const closePromoModal = useCallback(() => {
    setPromoModalVisible(false);
  }, []);
  const closeGiftsModal = useCallback(() => {
    setGiftsModalVisible(false);
  }, []);
  const { data, loading, error, refetch } = useGetCartWithProductsQuery();
  const products = data?.cart?.items;
  const gifts = data?.cart?.gifts;
  const price = data?.cart?.price ?? 0;
  const giftsAvailable = (gifts || []).length > 0;

  const totalCartItems = useMemo(() => {
    return data?.cart?.items.filter(x => x.price > 0).length || 0;
  }, [data]);
  const totalGifts = useMemo(() => {
    return data?.cart?.items.filter(x => x.price === 0).length || 0;
  }, [data]);

  return (
    <DataChecker
      key="data-checker"
      loading={loading}
      data={products}
      error={error}
      loadingLabel="Загрузка корзины"
      noDataLabel="В вашей корзине пусто"
      hideRefetchWhenNoData={true}
      refetch={refetch}
    >
      <View style={styles.container}>
        <DataContainer
          key="container"
          contentStyle={{ marginHorizontal: 0 }}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refetch} />}
          footerTopAdornment={
            <Footer price={price} quantity={totalCartItems} promoDiscount={0} gifts={totalGifts} />
          }
        >
          <View style={styles.products}>
            {products?.map(x => (
              <React.Fragment key={x.id}>
                <CartItemComp cartItem={x} />
                <SeparatorDash />
              </React.Fragment>
            ))}
          </View>

          {gifts && gifts.length > 0 ? (
            <GiftsModal visible={giftsModalVisible} close={closeGiftsModal} gifts={gifts} />
          ) : null}

          <View style={styles.header}>
            <Text style={styles.headerText}>Применение акций и скидок</Text>
          </View>
          <View style={styles.discountLinks}>
            {giftsAvailable ? (
              <Button
                title="Доступные подарки"
                startAdornment={<GiftIcon style={{ marginRight: theme.sizing(1) }} />}
                onPress={() => setGiftsModalVisible(true)}
                style={{ marginVertical: theme.sizing(1), width: '100%' }}
              />
            ) : null}

            <Button
              title="Есть промокод"
              startAdornment={<PromoCodeIcon style={{ marginRight: theme.sizing(1) }} />}
              onPress={() => setPromoModalVisible(true)}
              style={{ marginVertical: theme.sizing(1), width: '100%' }}
            />
            {data?.cart.coupons.map(x => (
              <Coupon key={x.id} data={x} />
            ))}
          </View>
          <ModalBonusPoints visible={bonusModalVisible} close={closeBonusModal} />
          <ModalPromoCode visible={promoModalVisible} close={closePromoModal} />
        </DataContainer>
      </View>
    </DataChecker>
  );
};

export const StepOne = React.memo<{}>(StepOneBase);
