import React from 'react';
import { Text, View } from 'react-native';
import {
  useGetBannersQuery,
  useGetCatalogRootQuery,
  useGetRecommendedQuery,
} from '../../apollo/requests';
import { DataContainer } from '../layouts/DataContainer/DataContainer';
import { CatalogRoot } from '../../components/CatalogRoot/CatalogRoot';
import { Loader } from '../../components/Loader/Loader';
import { TopSlider } from './TopSlider';
import { Leaders } from './Leaders';
import { BottomSlider } from './BottomSlider';
import { styles } from './Main.styles';

export { MainHeader } from './MainHeader';

export const Main = () => {
  const { loading: bannersLoading } = useGetBannersQuery({ fetchPolicy: 'cache-first' });
  const { data: recommendedData, loading: recommendedLoading } = useGetRecommendedQuery();
  const { loading: catalogRootLoading } = useGetCatalogRootQuery();

  if (bannersLoading || recommendedLoading || catalogRootLoading) {
    return (
      <DataContainer key="data" scrollContentStyle={styles.container}>
        <Loader key="loader" size="large" label="Загрузка главной страницы" />
      </DataContainer>
    );
  }

  return (
    <DataContainer key="data">
      <TopSlider key="top-slider" />
      {recommendedLoading || (!recommendedLoading && recommendedData?.recommended) ? (
        <>
          <View key="leaders-title" style={styles.titles}>
            <Text key="text" style={styles.titlesText}>
              ЛИДЕРЫ ДОМАШНИХ АПТЕЧЕК
            </Text>
          </View>
          <Leaders key="leaders" />
        </>
      ) : null}
      <BottomSlider key="bottom-slider" />
      <View key="catalog-title" style={styles.titles}>
        <Text key="text" style={styles.titlesText}>
          КАТАЛОГ
        </Text>
      </View>
      <CatalogRoot key="catalog-main" useSimpleContainer={true} style={styles.lists} />
      <View key="bottomSpace" style={styles.bottomSpace} />
    </DataContainer>
  );
};
