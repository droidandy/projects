import React, { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import useDimensions from '../../hooks/dimensions';
import { Image } from '../../components/Image/Image';
import Carousel from '../../components/Carousel/Carousel';
import { sliderImageSizes, topSliderStyles as styles } from './Main.styles';
import { BannerModel, GetBannersQuery, useGetBannersQuery } from '../../apollo/requests';
import { Loader } from '../../components/Loader/Loader';
import { Error } from '../../components/text/Error/Error';
import { getImageUrl } from '../../configs/environments';
import { handleAppLink } from '../../helpers/app-link';

const getSlides = (windowWidth: number, data?: GetBannersQuery): React.ReactNode[] => {
  const ratio: number = windowWidth / sliderImageSizes.width;

  if (!data || !data?.banners) {
    return [null];
  }

  return data.banners
    .filter((banner: BannerModel) => banner.location === 'TOP')
    .map(
      (banner: BannerModel): React.ReactNode => (
        <TouchableOpacity
          key={`${banner.__typename}:${banner.id}`}
          onPress={() => handleAppLink(banner.appLink)}
        >
          <Image
            key="image"
            source={{ uri: getImageUrl(banner.preview) }}
            style={{
              width: windowWidth,
              height: sliderImageSizes.height * ratio,
            }}
          />
        </TouchableOpacity>
      ),
    );
};

export const TopSlider = () => {
  // const appLinkNavigate = useAppLink();
  const { data, loading, error } = useGetBannersQuery({ fetchPolicy: 'cache-first' });
  const dimensions = useDimensions();
  const windowWidth: number = dimensions.window.width;
  const slides = useMemo(() => getSlides(windowWidth, data), [
    windowWidth,
    data,
    // appLinkNavigate,
  ]);

  if (loading || !data?.banners) {
    const ratio: number = windowWidth / sliderImageSizes.width;

    return (
      <View key="container" style={styles.container}>
        <View
          key="loader"
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: windowWidth,
            height: sliderImageSizes.height * ratio,
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
