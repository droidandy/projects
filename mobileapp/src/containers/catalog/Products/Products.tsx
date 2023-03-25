import React from 'react';
import { useNavigation } from '../../../hooks/navigation';
import { useGetProductsQuery } from '../../../apollo/requests';
import { keyExtractor } from '../../../helpers/models';
import { FlatDataContainer } from '../../layouts/FlatDataContainer/FlatDataContainer';
import { SeparatorDash } from '../../../components/SeparatorDash/SeparatorDash';
import { DataChecker } from '../../../components/DataChecker/DataChecker';
import { styles } from './Products.styles';
import { ProductListItem } from '../../../components/product/ProductListItem';

const ProductsBase = () => {
  const navigation = useNavigation<{ id: number; title: string }>();
  const { id } = navigation.state.params!; //TODO params types
  const { data, loading, error, refetch } = useGetProductsQuery({
    variables: { categoryId: id },
    notifyOnNetworkStatusChange: true,
  });
  return (
    <DataChecker
      key="data-checker"
      loading={loading}
      data={data?.products}
      error={error}
      loadingLabel="Загрузка списка товаров"
      noDataLabel="Товаров в данной категории нет"
      refetchLabel="Обновить"
      refetch={refetch}
    >
      <FlatDataContainer
        key="container"
        data={data?.products}
        renderItem={info => <ProductListItem product={info.item} />}
        keyExtractor={keyExtractor}
        ItemSeparatorComponent={SeparatorDash}
        contentContainerStyle={styles.list}
      />
    </DataChecker>
  );
};

export const Products = React.memo<{}>(ProductsBase);
