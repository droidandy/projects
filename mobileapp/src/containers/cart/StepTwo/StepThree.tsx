import React, { useEffect, useRef } from 'react';
import { View, Text } from 'react-native';
import { MutationResult } from '@apollo/react-common';
import { getCashFormat } from '../../../helpers/numbers';
import { useNavigation } from '../../../hooks/navigation';
import { CreateOrderMutation, ListPharmacyFragment } from '../../../apollo/requests';
import { DataContainer } from '../../layouts/DataContainer/DataContainer';
import { SeparatorDash } from '../../../components/SeparatorDash/SeparatorDash';
import { PharmacyRender } from '../../../components/pharmacies/PharmacyRender';
import { styles } from './StepTwo.styles';
import { DataChecker } from '../../../components/DataChecker/DataChecker';

interface Props {
  dataCreateOrder: MutationResult<CreateOrderMutation>;
  pharmacyData: ListPharmacyFragment;
  price: number;

  retryCreateOrder(): any;
}

const StepThreeBase: React.FC<Props> = ({
  dataCreateOrder,
  pharmacyData,
  price,
  retryCreateOrder,
}: Props) => {
  const once = useRef(false);
  const navigation = useNavigation();
  const createOrder = dataCreateOrder?.data?.createOrder;
  const loading = dataCreateOrder?.loading;
  const error = dataCreateOrder?.error;

  useEffect(() => {
    if (!once.current) {
      once.current = true;
      navigation.setParams({ title: 'Отправка заказа' });
    }
  }, [navigation]);

  if (!Number.isFinite(createOrder) || loading || !!error) {
    return (
      <DataChecker
        key="data-checker"
        data={Number.isFinite(createOrder)}
        loading={loading}
        error={error}
        loadingLabel="Заказ отправляется"
        noDataLabel="Не удалось сформировать заказ"
        refetch={retryCreateOrder}
      />
    );
  }

  return (
    <DataContainer key="container" scrollContentStyle={styles.containerScroll}>
      <View key="order" style={styles.order}>
        <Text key="label" style={styles.orderText}>
          Ваш заказ успешно отправлен
        </Text>
        <View key="number" style={styles.orderNumber}>
          <Text style={styles.orderText}># {createOrder}</Text>
        </View>
      </View>
      <View key="pharmacy" style={styles.pharmacyWithPhone}>
        <SeparatorDash key="separator-1" />
        <PharmacyRender pharmacy={pharmacyData} key={`PharmacyModel:${pharmacyData.xmlId}`} />
        <SeparatorDash key="separator-2" />
      </View>
      <View key="order-total" style={styles.orderTotal}>
        <Text key="label" style={styles.orderTotalLabel}>
          СУММА ЗАКАЗА:
        </Text>
        <Text key="total" style={styles.orderTotalSum}>
          {getCashFormat(price)} руб.
        </Text>
      </View>
    </DataContainer>
  );
};

export const StepThree = React.memo<Props>(StepThreeBase);
