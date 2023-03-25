import React, { PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Keyboard, RefreshControl, Text, View } from 'react-native';
import { useGetSearchProductsLazyQuery } from '../../../apollo/requests';
import { keyExtractor } from '../../../helpers/models';
import { ITEM_LIMIT } from '../../../helpers/const';
import { FlatDataContainer } from '../../layouts/FlatDataContainer/FlatDataContainer';
import { SeparatorDash } from '../../../components/SeparatorDash/SeparatorDash';
import { styles } from './Search.styles';
import { NetworkStatus } from 'apollo-client';
import { Loader } from '../../../components/Loader/Loader';
import { Error } from '../../../components/text/Error/Error';
import debounce from 'lodash/debounce';
import { ProductListItem } from '../../../components/product/ProductListItem';
import { useSearch } from '../../../contexts/common-data-provider';
import { useNavigation } from '../../../hooks/navigation';

const SearchBase = () => {
  const { search, setSearch } = useSearch();
  const navigation = useNavigation();
  const [hasMore, setHasMore] = useState(true);
  const [query, { data, refetch, fetchMore, networkStatus }] = useGetSearchProductsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
  });

  const term = search.trim();
  const runQuery = useCallback(
    (text: string) => {
      query({
        variables: {
          query: text,
          page: 1,
          limit: ITEM_LIMIT,
        },
      });
    },
    [query],
  );

  const debouncedQuery = useMemo(() => debounce(runQuery, 400), [runQuery]);

  useEffect(() => {
    if (navigation.state?.params?.query) {
      if (navigation.state.params.query.trim() !== term) {
        setSearch(navigation.state.params.query.trim());
        navigation.setParams({ query: undefined });
      }
    }
  }, [navigation, setSearch, term]);

  useEffect(() => {
    if (term) {
      debouncedQuery(term);
    }
  }, [debouncedQuery, term]);

  if (!term) {
    return <StartTyping />;
  }

  const products = data?.search?.products || [];
  const searchCount = products.length;

  switch (networkStatus) {
    case NetworkStatus.error: {
      return <Error text="Ошибка при выполнении запроса 🤨" />;
    }
    case NetworkStatus.loading:
    case NetworkStatus.setVariables: {
      return <Searching />;
    }
    case NetworkStatus.ready: {
      if (!products.length) {
        return (
          <Wrap>
            <Text key="no-data" style={styles.noData}>
              Ничего не найдено 😢
            </Text>
          </Wrap>
        );
      }
    }
  }

  return (
    <Wrap>
      <FlatDataContainer
        ListFooterComponent={
          <ActivityIndicator
            size="large"
            style={{ paddingTop: 24 }}
            animating={networkStatus === NetworkStatus.fetchMore}
          />
        }
        key="container"
        data={products}
        renderItem={info => <ProductListItem product={info.item} />}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={SeparatorDash}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={networkStatus === NetworkStatus.refetch}
            onRefresh={(): void => {
              if (term) {
                refetch({
                  query: term,
                  page: 1,
                  limit: ITEM_LIMIT,
                }).then(() => {
                  setHasMore(true);
                });
              }
            }}
          />
        }
        onEndReached={(): void => {
          const nextPage = Math.ceil(searchCount / ITEM_LIMIT + 1);
          const totalPages = data?.search?.allPage || 0;
          if (products?.length && hasMore && nextPage <= totalPages) {
            fetchMore({
              variables: { page: nextPage, limit: ITEM_LIMIT },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (!fetchMoreResult) return prev;
                const newValue = {
                  ...fetchMoreResult,
                  search: {
                    ...fetchMoreResult?.search,
                    products: [...prev.search.products, ...fetchMoreResult?.search?.products],
                  },
                };
                console.log('NEW', newValue.search.products.length);
                return newValue;
              },
            }).then(result => {
              console.log(
                'then hasmore',
                hasMore,
                '->',
                !(result?.data?.search?.products.length < ITEM_LIMIT) || true,
              );
              if (result?.data?.search?.products.length < ITEM_LIMIT) {
                setHasMore(false);
              }
            });
          }
        }}
        onEndReachedThreshold={0.5}
      />
    </Wrap>
  );
};

const StartTyping = () => (
  <Wrap>
    <Text key="no-data" style={styles.noData}>
      Начните вводить запрос 👆🏻
    </Text>
  </Wrap>
);

const Searching = () => {
  return (
    <Wrap>
      <Loader key="loader" size="large" label="Поиск товаров" />
    </Wrap>
  );
};

const Wrap = ({ children }: PropsWithChildren<any>) => {
  return (
    <View
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      onTouchStart={() => Keyboard.dismiss()}
    >
      {children}
    </View>
  );
};

export const Search = React.memo<{}>(SearchBase);
