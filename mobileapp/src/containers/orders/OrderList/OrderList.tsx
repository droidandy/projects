import React, { useState } from 'react';
import { keyExtractor } from '../../../helpers/models';
import { FlatDataContainer } from '../../layouts/FlatDataContainer/FlatDataContainer';
import { SeparatorDash } from '../../../components/SeparatorDash/SeparatorDash';
import { DataChecker } from '../../../components/DataChecker/DataChecker';
import { styles } from './OrderList.styles';
import { OrderListRenderItem } from '../../../components/OrderListItem/OrderListItem';
import { useGetOrdersQuery } from '../../../apollo/requests';
import { RefreshControl } from 'react-native';
import { ITEM_LIMIT } from '../../../helpers/const';

const OrderListBase: React.FC = () => {
  const [hasMore, setHasMore] = useState(true);
  const { data, loading, error, fetchMore, refetch } = useGetOrdersQuery({
    variables: { page: 1, limit: ITEM_LIMIT },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });
  const orders = data?.orders?.orders;
  const ordersCount = orders?.length || 0;
  const totalPages = data?.orders?.allPage || 0;

  if (loading || !orders || ordersCount === 0 || error) {
    return (
      <DataChecker
        key="data-checker"
        loading={loading}
        data={orders}
        error={error}
        loadingLabel="Загрузка истории заказов"
        noDataLabel="У Вас нет ни одного заказа"
        hideRefetchWhenNoData={true}
        refetch={refetch}
      />
    );
  }

  return (
    <FlatDataContainer
      key="container"
      data={orders}
      renderItem={OrderListRenderItem}
      keyExtractor={keyExtractor}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={(): void => {
            refetch({ page: 1, limit: ITEM_LIMIT }).then(() => {
              setHasMore(true);
            });
          }}
        />
      }
      ItemSeparatorComponent={SeparatorDash}
      contentContainerStyle={styles.list}
      onMomentumScrollEnd={(): void => {
        const nextPage = Math.ceil(ordersCount / ITEM_LIMIT + 1);
        if (hasMore && nextPage <= totalPages) {
          fetchMore({
            variables: { page: nextPage, limit: ITEM_LIMIT },
            updateQuery: (prev, { fetchMoreResult }) => {
              if (!fetchMoreResult) return prev;
              return {
                ...fetchMoreResult,
                orders: {
                  ...fetchMoreResult?.orders,
                  orders: [...prev?.orders?.orders, ...fetchMoreResult?.orders?.orders],
                },
              };
            },
          }).then(result => {
            if (result.data?.orders?.orders.length < ITEM_LIMIT) {
              setHasMore(false);
            }
          });
        }
      }}
      onEndReachedThreshold={0.5}
    />
  );
};

export const OrderList = React.memo<{}>(OrderListBase);
