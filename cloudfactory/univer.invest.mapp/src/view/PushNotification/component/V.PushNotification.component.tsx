import React from 'react';
import { Animated, PanResponder, PanResponderInstance, StyleSheet, TouchableOpacity } from 'react-native';
import moment from 'moment';

import { shadowStyle } from '@invest.wl/mobile/src/view/util/style.util';
import { VCol, VImage, VRow, VText } from '@invest.wl/mobile/src/view/kit';
import { observer } from 'mobx-react';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { isIphoneXGeneration, themeSpaces } from '@invest.wl/mobile/src/view/Theme/V.Theme.util';
import { VNotificationImportantModel } from '@invest.wl/view/src/Notification/model/V.NotificationImportant.model';

interface State {
  show: boolean;
  containerSlideOffsetY: any;
  containerDragOffsetY: any;
  containerScale: any;
}

export interface IVPushNotificationProps {
  model: VNotificationImportantModel;
}

@observer
export class VPushNotification extends React.Component<IVPushNotificationProps, State> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  private _timeout: any;
  private _panResponder: PanResponderInstance;

  constructor(props: any) {
    super(props);
    this.state = {
      show: false,
      containerSlideOffsetY: new Animated.Value(0),
      containerDragOffsetY: new Animated.Value(0),
      containerScale: new Animated.Value(1),
    };
    this._panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 1,
      onPanResponderMove: this._onPanResponderMove,
      onPanResponderRelease: this._onPanResponderRelease,
    });
  }

  public componentDidMount() {
    this._show();
    this._restartTimeOut();
  }

  public componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  public componentDidUpdate() {
    this._restartTimeOut();
  }

  public render() {
    const { model } = this.props;
    const { containerSlideOffsetY, containerDragOffsetY, containerScale, show } = this.state;

    if (!show || !this._panResponder || !this._panResponder.panHandlers) return null;
    const { color } = this.theme;

    return (
      <Animated.View
        style={getAnimatedContainerStyle({ containerSlideOffsetY, containerDragOffsetY, containerScale })}
        {...this._panResponder.panHandlers}
      >
        <TouchableOpacity onPress={model.domain.dto.onPress}>
          <VCol height={90} pa={10} radius={16} bg={color.base} justifyContent={'space-between'}>
            <VRow justifyContent={'space-between'} alignItems={'center'}>
              <VRow alignItems={'center'}>
                <VImage width={20} height={20} resizeMode={'contain'} borderRadius={4} mr={8}
                  source={require('../../../assets/image/IconLogo.png')} />
                <VText font={'body6'}>{'UNIVER-MA.Dev'}</VText>
              </VRow>
              <VText font={'caption2'}>{'Сейчас'}</VText>
            </VRow>
            <VText font={'body4'}>{model.title}</VText>
            <VText font={'body6'}>{model.message}</VText>
          </VCol>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  private _onPanResponderMove = (_: any, gestureState: any) => {
    const { containerDragOffsetY } = this.state;
    const newDragOffset = gestureState.dy < 100 ? gestureState.dy : 100;
    containerDragOffsetY.setValue(newDragOffset);
  };

  private _onPanResponderRelease = () => {
    const { containerDragOffsetY } = this.state;

    if (containerDragOffsetY._value < -30) {
      this._slideOutAndDismiss(200);
    } else {
      Animated.timing(containerDragOffsetY, { toValue: 0, duration: 200, useNativeDriver: true }).start();
    }
  };

  private _slideOutAndDismiss = (duration: any) => {
    const { containerSlideOffsetY } = this.state;
    Animated.timing(containerSlideOffsetY, { toValue: 0, duration: duration ?? 400, useNativeDriver: true }).start();
  };

  private _slideIn = () => {
    const { containerSlideOffsetY } = this.state;
    Animated.timing(containerSlideOffsetY, { toValue: 1, duration: 400, useNativeDriver: true }).start();
  };

  private _show = () => {
    this.setState({
      show: true,
      containerSlideOffsetY: new Animated.Value(0),
      containerDragOffsetY: new Animated.Value(0),
      containerScale: new Animated.Value(1),
    }, this._slideIn);
  };

  private _restartTimeOut = () => {
    clearTimeout(this._timeout);
    const timeout = -moment().diff(this.props.model.closeTime);
    this._timeout = setTimeout(() => {
      this._slideOutAndDismiss(200);
    }, timeout);
  };
}

const slideOffsetYToTranslatePixelMapping = {
  inputRange: [0, 1],
  outputRange: [-150, 0],
};

const slideOffsetYToTranslatePixelMappingIphoneX = {
  inputRange: [0, 1],
  outputRange: [-200, 0],
};

const getAnimatedContainerStyle = ({ containerSlideOffsetY, containerDragOffsetY, containerScale }: any) => {
  let slideInAnimationStyle = null;
  if (isIphoneXGeneration && isIphoneXGeneration()) {
    slideInAnimationStyle = {
      transform: [
        { translateY: containerSlideOffsetY.interpolate(slideOffsetYToTranslatePixelMappingIphoneX) },
        { translateY: containerDragOffsetY },
        { scale: containerScale },
      ],
    };
  } else {
    slideInAnimationStyle = {
      transform: [
        { translateY: containerSlideOffsetY.interpolate(slideOffsetYToTranslatePixelMapping) },
        { translateY: containerDragOffsetY },
        { scale: containerScale },
      ],
    };
  }

  return [SS.popupContainer, slideInAnimationStyle];
};

const SS = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
    width: '98%',
    top: themeSpaces.md,
    ...shadowStyle(2),
  },
});
