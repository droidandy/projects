import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '../../../hooks/navigation';
import { useGetCategoriesQuery } from '../../../apollo/requests';
import { keyExtractor } from '../../../helpers/models';
import { DataContainer } from '../../layouts/DataContainer/DataContainer';
import { DataChecker } from '../../../components/DataChecker/DataChecker';
import { SeparatorLine } from '../../../components/SeparatorLine/SeparatorLine';
import { SubCategory } from './SubCategory';
import { styles } from './Category.styles';

export const Category = () => {
  const navigation = useNavigation<{ title: string; id: number }>();
  const { id } = navigation.state.params!; //TODO params types
  const { data, loading, error, refetch } = useGetCategoriesQuery({
    variables: { id },
    notifyOnNetworkStatusChange: true,
  });
  const categories = data?.categories;

  if (loading || !categories || categories?.length === 0 || error) {
    return (
      <DataChecker
        key="data-checker"
        loading={loading}
        data={categories}
        error={error}
        loadingLabel="Загрузка списка категорий"
        noDataLabel="Подкатегорий в данной категории нет"
        refetchLabel="Обновить"
        refetch={refetch}
      />
    );
  }

  const chunkedCategories: React.ReactNode[][] = [];
  let lastKey: number | undefined;
  categories.forEach((category, index: number) => {
    const key = category.name.charCodeAt(0);
    const reactKey = keyExtractor(category, index);

    lastKey = key;

    if (!chunkedCategories[key]) {
      chunkedCategories[key] = [];
    }

    chunkedCategories[key].push(
      <SubCategory category={category} key={reactKey} />,
      <SeparatorLine key={reactKey + '-separator'} />,
    );
  });

  if (lastKey) {
    chunkedCategories[lastKey][chunkedCategories[lastKey].length - 1] = null;
  }

  return (
    <DataContainer key="container" contentStyle={styles.content}>
      {chunkedCategories.map((chunk, index: number) => (
        <View key={'chunk-' + index.toString()} style={styles.chunk}>
          <View key="word" style={styles.chunkWord}>
            <Text style={styles.chunkWordText}>{String.fromCharCode(index)}</Text>
          </View>
          <View key="items" style={styles.chunkItems}>
            {chunk}
          </View>
        </View>
      ))}
    </DataContainer>
  );
};
