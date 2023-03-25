import React, { useMemo } from 'react';
import { View } from 'react-native';
import useDimensions from '../../hooks/dimensions';
import { GetRecommendedQuery, useGetRecommendedQuery } from '../../apollo/requests';
import Carousel from '../../components/Carousel/Carousel';
import { ProductsList } from '../../components/product/ProductsList';
import { Loader } from '../../components/Loader/Loader';
import { Error } from '../../components/text/Error/Error';
import { leadersSliderStyles as styles } from './Main.styles';

const getSlides = (leaders?: GetRecommendedQuery): React.ReactNode[] => {
  if (!leaders) {
    return [null];
  }

  return [0, 1].map(
    (text: number, key: number): React.ReactNode => {
      const data = leaders.recommended.slice(key * 4, key * 4 + 4);

      return (
        <ProductsList
          key={`leaders-section-${key}`}
          scroll={false}
          data={data}
          style={styles.slide}
        />
      );
    },
  );
};

export const Leaders = () => {
  const dimensions = useDimensions();
  const windowWidth: number = dimensions.window.width;
  const { data, loading, error } = useGetRecommendedQuery();
  const slides = useMemo(() => getSlides(data), [data]);

  if (loading || !data?.recommended) {
    return (
      <View key="container" style={styles.container}>
        <Loader key="loader" size="large" label="Список товаров загружается" />
      </View>
    );
  }

  if (error && error.graphQLErrors[0]) {
    return (
      <View key="container" style={styles.container}>
        <Error key="error" text={error.graphQLErrors[0].message} />
      </View>
    );
  } else if (error) {
    return (
      <View key="container" style={styles.container}>
        <Error key="error" text="Произошла непредвиденная ошибка" />
      </View>
    );
  }

  return (
    <View key="container" style={styles.container}>
      <Carousel
        key="carousel"
        paginationType="dots"
        data={slides}
        sliderWidth={windowWidth}
        itemWidth={windowWidth}
      />
    </View>
  );
};
