import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { getImageUrl } from '../../configs/environments';
import useDimensions from '../../hooks/dimensions';
import { PromoActionModel, useGetPromoActionsQuery } from '../../apollo/requests';

import { Image } from '../../components/Image/Image';
import Carousel from '../../components/Carousel/Carousel';
import { Loader } from '../../components/Loader/Loader';
import { Error } from '../../components/text/Error/Error';

import { bottomSliderStyles as styles, sliderBottomImageSizes } from './Main.styles';
import { useNavigation } from '../../hooks/navigation';
import { ROUTES } from '../../configs/routeName';
import { ApolloError } from 'apollo-client';
import { theme } from '../../helpers/theme';

export const useGetPromoSlides = (): {
  slides: React.ReactNode[];
  loading: boolean;
  error?: ApolloError;
} => {
  const { data, loading, error } = useGetPromoActionsQuery({ fetchPolicy: 'cache-first' });
  const { navigate } = useNavigation();

  if (loading) {
    return { slides: [], loading };
  }

  if (error) {
    return { slides: [], loading: false, error };
  }

  if (!data || !data?.promoActions) {
    return { slides: [], loading: false };
  }

  const slides = data.promoActions.map((banner: PromoActionModel) => (
    <TouchableOpacity
      key={`${banner.__typename}:${banner.id}`}
      onPress={() => navigate(ROUTES.promoAction, { title: banner.name, id: banner.id })}
      style={{ marginBottom: theme.sizing(1) }}
    >
      <Image
        key="image"
        source={{ uri: getImageUrl(banner.preview) }}
        style={{
          width: '100%',
          aspectRatio: sliderBottomImageSizes.aspect,
          resizeMode: 'cover',
        }}
      />
    </TouchableOpacity>
  ));
  return { slides, loading: false };
};

export const BottomSlider = () => {
  const dimensions = useDimensions();
  const windowWidth: number = dimensions.window.width;
  const { loading, slides, error } = useGetPromoSlides();

  if (loading) {
    const ratio: number = windowWidth / sliderBottomImageSizes.width;
    return (
      <View key="container" style={styles.container}>
        <View
          key="loader"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: windowWidth,
            height: sliderBottomImageSizes.height * ratio,
          }}
        >
          <Loader size="large" label="Загрузка баннеров" />
        </View>
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
        loop={true}
        autoplay={true}
      />
    </View>
  );
};
