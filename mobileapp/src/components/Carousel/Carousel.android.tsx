import React, { useRef, useState } from 'react';
import { ListRenderItemInfo, StyleProp, TextStyle, TouchableHighlight, View } from 'react-native';
import NativeCarousel, { CarouselProps as NativeCarouselProps } from 'react-native-snap-carousel';

import { getPaginationContentDots, getPaginationContentText } from './Carousel.utils';
import { styles } from './Carousel.style';
import { useNavigation } from '../../hooks/navigation';
import { loginRoute } from '../../configs/routeName';
import {
  Directions,
  FlingGestureHandler,
  NativeViewGestureHandler,
  State,
} from 'react-native-gesture-handler';

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
      <FlingGestureHandler
        direction={Directions.LEFT}
        onGestureEvent={console.log}
        enabled={props.navigateToLoginOnLastSlide && activeSlide === lastSlide}
        shouldCancelWhenOutside={false}
        onHandlerStateChange={e => {
          const { nativeEvent } = e;
          if (nativeEvent.state === State.ACTIVE) {
            navigate(loginRoute);
          }
        }}
      >
        <NativeViewGestureHandler>
          <NativeCarousel
            {...props}
            ref={ref}
            layout="default"
            renderItem={renderItem}
            onSnapToItem={setActiveSlide}
          />
        </NativeViewGestureHandler>
      </FlingGestureHandler>
      {pagination()}
    </>
  );
};

export default Carousel;
