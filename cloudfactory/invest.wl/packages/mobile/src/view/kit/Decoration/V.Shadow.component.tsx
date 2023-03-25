import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import Color from 'color';
import { action, computed, makeObservable, observable } from 'mobx';
import { Observer, observer } from 'mobx-react';
import React from 'react';
import { LayoutChangeEvent, Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Shadow } from 'react-native-neomorph-shadows';
import { VThemeUtil } from '../../Theme/V.Theme.util';
import { flexView, IFlexProps } from '../Layout/Flex/V.Flex.util';

export interface IVDecorationShadowProps extends IFlexProps {
  style?: StyleProp<ViewStyle>;
  inner?: boolean;
  useArt?: boolean;
  level: number;
}

// коэффициенты изменения параметров теневых уровней
interface IElevationCfc {
  lighten: number;
  radius: number;
  opacity: number;
}

const isAndroid = Platform.OS === 'android';

@flexView()
@observer
export class VShadow extends React.Component<IVDecorationShadowProps> {
  public static defaultProps = {
    level: 1,
  };

  private _levelCoefMap: IElevationCfc[] = [
    { lighten: 0, radius: 1, opacity: 1 },
    { lighten: 0.1, radius: 1.2, opacity: 0.9 },
    { lighten: 0.2, radius: 1.4, opacity: 0.8 },
    { lighten: 0.3, radius: 1.6, opacity: 0.7 },
    { lighten: 0.4, radius: 1.8, opacity: 0.6 },
    { lighten: 0.5, radius: 2, opacity: 0.5 },
    { lighten: 0.6, radius: 2.2, opacity: 0.4 },
    { lighten: 0.7, radius: 2.4, opacity: 0.3 },
    { lighten: 0.8, radius: 2.6, opacity: 0.2 },
    { lighten: 0.9, radius: 2.8, opacity: 0.1 },
    { lighten: 1, radius: 3, opacity: 0.05 },
  ];

  @observable public width?: number = undefined;
  @observable public height?: number = undefined;

  @computed
  private get _key() {
    // костыль для насильной полной перерисовки, иначе тень съезжает с изменением размеров
    return `${this.width}@${this.height}`;
  }

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVDecorationShadowProps) {
    super(props);
    makeObservable(this);
  }

  @action
  private onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (this.width === width && this.height === height) return;
    this.width = width;
    this.height = height;
  };

  @computed
  private get style(): any {
    if (isAndroid) {
      // const { elevation, shadowOffset, shadowColor, shadowRadius, shadowOpacity } = this._style.shadow;
      return this.props.style;
    } else {
      return { ...(this.props.style ? this.props.style as ViewStyle : {}), ...this._style.shadow };
    }
  }

  @computed
  private get styleShadow(): any {
    if (!this.height) return;
    const {
      shadowOffset, shadowColor, shadowRadius, shadowOpacity, backgroundColor,
    } = this._style.shadow;
    if (isAndroid) {
      return {
        shadowOffset, shadowColor, shadowRadius, shadowOpacity, backgroundColor,
        borderRadius: (this.props.style as ViewStyle)?.borderRadius,
        height: this.height, width: this.width, position: 'absolute',
      };
    }
  }

  public render() {
    const { children, elevation, ...otherProps } = this.props;
    if (isAndroid) {
      return (
        <View onLayout={this.onLayout} style={this.style}>
          <Observer>{() => {
            if (!this.styleShadow) return null;
            return <Shadow {...otherProps} style={this.styleShadow} key={this._key} />;
          }}</Observer>
          {children}
        </View>
      );
    } else {
      return (
        <Shadow {...otherProps} style={this.style}>
          {children}
        </Shadow>
      );
    }
  }

  @computed
  private get _style() {
    const theme = this.theme.kit.Shadow;
    const level = this.props.level;
    const cfc = this._levelCoefMap[level];
    return StyleSheet.create({
      shadow: {
        shadowOffset: { width: theme.sWidth?.md ?? 0, height: theme.sHeight?.md ?? 2 },
        shadowColor: new Color(VThemeUtil.colorPick(theme.cMain)).lighten(cfc.lighten).hex(),
        shadowRadius: theme.radius * cfc.radius,
        shadowOpacity: theme.opacity * cfc.opacity,
        backgroundColor: (this.props.style as ViewStyle)?.backgroundColor,
      },
    });
  }
}
