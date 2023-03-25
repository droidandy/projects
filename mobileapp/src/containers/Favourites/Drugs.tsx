import React from 'react';
import { keyExtractor } from '../../helpers/models';
import { FlatDataContainer } from '../layouts/FlatDataContainer/FlatDataContainer';
import { DataChecker } from '../../components/DataChecker/DataChecker';
import { SeparatorDash } from '../../components/SeparatorDash/SeparatorDash';
import { styles } from '../catalog/Products/Products.styles';
import { ProductListItem } from '../../components/product/ProductListItem';
import { useGetFavouriteProductsQuery } from '../../apollo/requests';

const DrugsBase = () => {
  const { data, loading, error, refetch } = useGetFavouriteProductsQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-first',
  });

  const favoritesProducts = data?.user.favoriteProducts;

  return (
    <DataChecker
      key="data-checker"
      loading={loading}
      data={favoritesProducts}
      error={error}
      loadingLabel="Загрузка списка избранных товаров"
      noDataLabel="Вы ещё не добавили ни одного товара в список избранных"
      hideRefetchWhenNoData={true}
      refetch={refetch}
    >
      <FlatDataContainer
        key="container"
        data={favoritesProducts}
        renderItem={info => <ProductListItem product={info.item} />}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={SeparatorDash}
        contentContainerStyle={styles.list}
      />
    </DataChecker>
  );
};

export const Drugs = React.memo<{}>(DrugsBase, () => true);
