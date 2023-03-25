import * as React from 'react';
import { ImageSourcePropType, View } from 'react-native';
import useDimensions from '../../../hooks/dimensions';
import { loginRoute } from '../../../configs/routeName';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import { Title } from '../../../components/text/Title/Title';
import { Image } from '../../../components/Image/Image';
import { Link } from '../../../components/buttons/Link/Link';
import Carousel from '../../../components/Carousel/Carousel';

import { styles } from './Initialize.style';
import IMAGES from '../../../resources';

type Slides = {
  title: string;
  description: string;
  icon: ImageSourcePropType;
};
const slidesContent: Slides[] = [
  {
    title: 'Надежность',
    description: 'Только сертифицированные товары напрямую от производителей и поставщиков',
    icon: IMAGES.slides.pill,
  },
  {
    title: 'Акции',
    description: 'Акции, специальные предложения каждый день',
    icon: IMAGES.slides.discounts,
  },
  {
    title: 'Бонусы',
    description: 'Накапливай до 5% от суммы чека',
    icon: IMAGES.slides.bonuses,
  },
];
const slides = slidesContent.map(
  (slide, key): React.ReactNode => (
    <React.Fragment key={key}>
      <Image source={slide.icon} />
      <Title style={styles.title} text={slide.title} />
      <Title style={styles.description} text={slide.description} />
    </React.Fragment>
  ),
);
export const Initialize = (): JSX.Element => {
  const horizontalMargin = 14;
  const dimensions = useDimensions();

  const sliderWidth = dimensions.window.width;
  const itemWidth = sliderWidth - horizontalMargin * 2;

  return (
    <AuthLayout key="container" hideScreenPadding={true}>
      <View key="top-space" style={styles.topSpace} />
      <View key="content" style={styles.content}>
        <Carousel
          paginationType="text"
          paginationStyle={styles.carouselPagination}
          data={slides}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          containerCustomStyle={styles.carouselContainerCustom}
          navigateToLoginOnLastSlide={true}
        />
      </View>
      <View style={{ flexShrink: 0 }}>
        <Link style={styles.link} title="Пропустить" link={loginRoute} />
      </View>
    </AuthLayout>
  );
};
