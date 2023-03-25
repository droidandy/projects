import { observer } from 'mobx-react';
import * as React from 'react';
import { Animated, Easing, ImageProps } from 'react-native';
import { IVFlexProps, VCol } from '../../../Layout/Flex';
import { VImage } from '../../../Output/Image';
import { VSpinner } from '../../V.Spinner.component';

interface Props extends IVFlexProps {
  image?: ImageProps['source'] | string;
}

@observer
export class VStubLoading extends React.Component<Props> {
  private _spinValue = new Animated.Value(0);

  public render() {
    const { image, ...props } = this.props;

    return (
      <VCol flex alignItems={'center'} justifyContent={'center'} {...props}>
        {!!image ? this._renderImage() : <VSpinner size="large" />}
      </VCol>
    );
  }

  public _renderImage() {
    const { image } = this.props;

    // First set up animation
    Animated.loop(Animated.timing(
      this._spinValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      },
    )).start();

    // Second interpolate beginning and end values (in this case 0 and 1)
    const spin = this._spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

    return (
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <VImage source={image!} />
      </Animated.View>
    );
  }
}
