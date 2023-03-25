import React, { useRef, useState } from 'react';
import { ListRenderItemInfo, StyleProp, TextStyle, TouchableHighlight, View } from 'react-native';
import NativeCarousel, { CarouselProps as NativeCarouselProps } from 'react-native-snap-carousel';

import { getPaginationContentDots, getPaginationContentText } from './Carousel.utils';
import { styles } from './Carousel.style';
import { useNavigation } from '../../hooks/navigation';
import { loginRoute } from '../../configs/routeName';

export interface CarouselProps
  extends Omit<
    NativeCarouselProps<React.ReactNode>,
    'ref' | 'renderItem' | 'onSnapToItem' | 'onPress'
  > {
  paginationStyle?: StyleProp<TextStyle>;
  paginationType: 'dots' | 'text';
  navigateToLoginOnLastSlide?: boolean;
}

const renderItem = (item: ListRenderItemInfo<any>) => {
  return (
    <TouchableHighlight key={item.index} underlayColor="transparent" activeOpacity={0.25}>
      <View style={styles.item}>{item.item}</View>
    </TouchableHighlight>
  );
};

const Carousel = (props: CarouselProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const start = useRef({ x: 0, y: 0 });
  const { navigate } = useNavigation();
  const ref = useRef<NativeCarousel<any>>(null);
  const { data, paginationStyle, paginationType } = props;
  const lastSlide = data.length - 1;

  const pagination = () => {
    return paginationType === 'text'
      ? getPaginationContentText(activeSlide, data.length, paginationStyle)
      : getPaginationContentDots(activeSlide, data.length, paginationStyle);
  };
  return (
    <>
      <NativeCarousel
        {...props}
        ref={ref}
        layout="default"
        renderItem={renderItem}
        onSnapToItem={setActiveSlide}
        onResponderGrant={() => {
          start.current = { x: 0, y: 0 };
        }}
        onResponderMove={e => {
          const { pageX, pageY } = e.nativeEvent;
          if (start.current.x === 0 && start.current.y === 0) {
            start.current.x = pageX;
            start.current.y = pageY;
          }
        }}
        onResponderEnd={e => {
          const distance = start.current.x - e.nativeEvent.pageX;
          if (props.navigateToLoginOnLastSlide) {
            if (activeSlide === lastSlide && distance > 30) {
              navigate(loginRoute);
            }
          }
        }}
      />
      {pagination()}
    </>
  );
};

export default Carousel;
