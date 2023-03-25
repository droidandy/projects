import React, { useCallback, useState } from 'react';
import { Text, View } from 'react-native';
import { getCashFormat } from '../../../helpers/numbers';
import { useNavigation } from '../../../hooks/navigation';
import { ListPharmacyFragment, useCreateOrderMutation } from '../../../apollo/requests';
import { Pharmacies as PharmaciesComponent } from '../../../components/pharmacies/Pharmacies';
import { Button } from '../../../components/buttons/Button/Button';
import { PharmacyCartItem } from '../../../components/pharmacies/PharmacyCartItem';
import { StepThree } from './StepThree';
import { styles } from './StepTwo.styles';
import { useResetCart } from '../../../hooks/cache';

const StepTwoBaseContainer = () => {
  const resetCart = useResetCart();
  const [isSwitchedToStepThree, setIsSwitchedToStepThree] = useState(false);
  const [activePharmacy, setActivePharmacy] = useState<ListPharmacyFragment | undefined>(undefined);
  const navigation = useNavigation<{ price: number }>();
  const { price } = navigation.state.params!;
  const [doCreateOrder, dataCreateOrder] = useCreateOrderMutation();
  const switchToStepThree = useCallback(async () => {
    if (!activePharmacy) return;
    setIsSwitchedToStepThree(true);
    try {
      await doCreateOrder({
        variables: {
          pharmacyId: activePharmacy.id,
        },
      });
      resetCart();
    } catch (e) {
      console.error(e);
    }
  }, [activePharmacy, doCreateOrder, resetCart]);
  const renderItem = useCallback(
    info => (
      <PharmacyCartItem
        activePharmacy={activePharmacy}
        onPress={setActivePharmacy}
        pharmacyData={info.item}
        fly
      />
    ),
    [activePharmacy],
  );

  if (activePharmacy && isSwitchedToStepThree) {
    return (
      <StepThree
        key="step-three"
        dataCreateOrder={dataCreateOrder}
        pharmacyData={activePharmacy}
        retryCreateOrder={switchToStepThree}
        price={price}
      />
    );
  }

  return (
    <PharmaciesComponent
      activePharmacy={activePharmacy}
      onMarkerPress={setActivePharmacy}
      renderItem={renderItem}
      footerTopAdornment={
        <View>
          <View key="amount-price" style={styles.amountPriceContainer}>
            <View key="left" style={styles.left}>
              <Text style={styles.orderAmount}>Сумма заказа:</Text>
            </View>
            <View key="right" style={styles.right}>
              <Text style={styles.priceText}>{getCashFormat(price)} руб.</Text>
            </View>
          </View>
          <Button
            key="confirm"
            title={activePharmacy ? 'Оформить заказ' : 'Выберите аптеку получения'}
            onPress={switchToStepThree}
            disabled={!activePharmacy}
          />
        </View>
      }
    />
  );
};

export const StepTwo = React.memo<{}>(StepTwoBaseContainer);
