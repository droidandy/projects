import React from 'react';
import { Alert, Text, View } from 'react-native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { cartStepOneRoute } from '../../../configs/routeName';
import { keyExtractor } from '../../../helpers/models';
import {
  GetCartDocument,
  useCancelOrderMutation,
  useGetOrderQuery,
  useReOrderMutation,
} from '../../../apollo/requests';
import { useNavigation } from '../../../hooks/navigation';
import { getCashFormat } from '../../../helpers/numbers';
import { theme } from '../../../helpers/theme';
import { FlatDataContainer } from '../../layouts/FlatDataContainer/FlatDataContainer';
import { SeparatorDash } from '../../../components/SeparatorDash/SeparatorDash';
import { DataChecker } from '../../../components/DataChecker/DataChecker';
import { OrderProductRenderItem } from '../../../components/OrderItem/OrderItem';
import { Button } from '../../../components/buttons/Button/Button';

import { styles } from './Order.styles';

const OrderBase = () => {
  const navigation = useNavigation<{ id: number }>();
  const { id } = navigation.state.params!; //TODO params
  const { data, loading, error, refetch } = useGetOrderQuery({
    variables: { orderId: id },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const isPossibleCancel = !data?.order?.isPossibleCancel;
  const { showActionSheetWithOptions } = useActionSheet();
  const options = isPossibleCancel
    ? ['Повторить заказ', 'Отмена']
    : ['Отменить заказ', 'Повторить заказ', 'Отмена'];
  const destructiveButtonIndex = isPossibleCancel ? undefined : 0;
  const cancelButtonIndex = isPossibleCancel ? 1 : 2;
  const [doCancelOrder] = useCancelOrderMutation();
  const [doReOrder] = useReOrderMutation({
    variables: { orderId: id },
    refetchQueries: [{ query: GetCartDocument }],
  });
  if (loading || !data?.order || error) {
    return (
      <DataChecker
        key="data-checker"
        loading={loading}
        data={data?.order}
        error={error}
        loadingLabel="Получение информации о заказе"
        noDataLabel="Не удалось получить информацию о заказе"
        refetch={refetch}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatDataContainer
        key="container"
        data={data?.order?.basket}
        renderItem={OrderProductRenderItem}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={SeparatorDash}
        contentContainerStyle={styles.list}
        pagingEnabled={true}
        onEndReachedThreshold={0.5}
        footerTopAdornment={
          <View key="order-total" style={styles.orderTotal}>
            <View key="order-price" style={styles.amountPriceContainer}>
              <View style={styles.left}>
                <Text style={styles.orderAmount}>Сумма заказа:</Text>
              </View>
              <View style={styles.right}>
                <Text style={styles.priceText}>{getCashFormat(data?.order?.price)} руб.</Text>
              </View>
            </View>
            <View key="order-status" style={styles.amountPriceContainer}>
              <View style={styles.left}>
                <Text style={styles.orderStatus}>Статус заказа:</Text>
              </View>
              <View style={styles.right}>
                <Text style={[styles.status, { color: data?.order?.statusColor || theme.black }]}>
                  {data?.order.statusName}
                </Text>
              </View>
            </View>
            <Button
              key="actions"
              style={styles.buttonActions}
              title="Действия над заказом"
              onPress={(): void => {
                showActionSheetWithOptions(
                  {
                    title: 'Что вы хотите сделать с заказом?',
                    options,
                    cancelButtonIndex,
                    destructiveButtonIndex,
                  },
                  buttonIndex => {
                    switch (buttonIndex) {
                      case destructiveButtonIndex:
                        doCancelOrder({
                          variables: {
                            orderId: id,
                          },
                        }).then(() => {
                          refetch().catch(console.error);
                        });
                        break;
                      case cancelButtonIndex:
                        break;
                      default:
                        doReOrder()
                          .then(() => {
                            navigation.navigate(cartStepOneRoute);
                          })
                          .catch(e => {
                            console.warn(e);
                            Alert.alert('Извините', 'К сожалению этот заказ нельзя повторить');
                          });

                        break;
                    }
                  },
                );
              }}
            />
          </View>
        }
      />
    </View>
  );
};

export const Order = React.memo<{}>(OrderBase);
