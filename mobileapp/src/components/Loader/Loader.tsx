import React, { useState, useEffect } from 'react';
import { Animated, Easing, StyleProp, Text, TextStyle, View, ViewStyle } from 'react-native';
import { styles } from './Loader.styles';
import IMAGES from '../../resources';

interface Props {
  size?: 'small' | 'medium' | 'large' | 'huge';
  color?: 'green' | 'white';
  label?: string;
}

interface AnimationProps {
  image: any;
  duration: number;
}

const AnimationBase = ({ image, duration }: AnimationProps) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(fadeAnim, {
        toValue: 1440,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [duration, fadeAnim]);

  return (
    <Animated.Image
      key="animated-image"
      source={image}
      resizeMode="contain"
      resizeMethod="scale"
      style={{
        transform: [
          {
            rotate: fadeAnim.interpolate({
              inputRange: [0, 1440],
              outputRange: ['0deg', '1440deg'],
            }),
          },
        ],
      }}
    />
  );
};

const Animation = React.memo<AnimationProps>(AnimationBase);

const LoaderBase: React.FC<Props> = ({ size, color, label }: Props) => {
  const isLoaderGreen = color === 'green';
  let loaderImage;
  let loaderDuration = 2880;
  let containerStyle: StyleProp<ViewStyle> = styles.container;
  let labelStyle: StyleProp<ViewStyle> = styles.label;
  let textStyle: StyleProp<TextStyle>;

  switch (size) {
    case 'small':
      loaderImage = isLoaderGreen ? IMAGES.loader.small.green : IMAGES.loader.small.white;
      textStyle = styles.textSmall;
      break;
    case 'medium':
      loaderImage = isLoaderGreen ? IMAGES.loader.medium.green : IMAGES.loader.medium.white;
      textStyle = styles.textMedium;
      break;
    case 'large':
      loaderImage = isLoaderGreen ? IMAGES.loader.large.green : IMAGES.loader.large.white;
      textStyle = styles.textLarge;
      break;
    case 'huge':
      loaderImage = isLoaderGreen ? IMAGES.loader.huge.green : IMAGES.loader.huge.white;
      loaderDuration = 3600;
      containerStyle = styles.containerHuge;
      labelStyle = styles.labelHuge;
      textStyle = styles.textHuge;
      break;
  }

  return (
    <View key="container" style={containerStyle}>
      <View key="image">
        <Animation key="animation" image={loaderImage} duration={loaderDuration} />
      </View>
      {label ? (
        <View key="label" style={labelStyle}>
          <Text key="text" style={textStyle}>
            {label}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export const LoaderScreen = ({ label }: { label: string }) => {
  return (
    <View
      key="container"
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Loader key="loader" size="large" label={label} />
    </View>
  );
};

LoaderBase.defaultProps = {
  size: 'large',
  color: 'green',
} as Partial<Props>;

export const Loader = React.memo<Props>(LoaderBase);
