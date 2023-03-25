import { IoC } from '@invest.wl/core';
import { TVThemeFont, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ColorValue, StyleProp, StyleSheet, Text as RNText, TextProps, TextStyle, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { fontScaleFactor, styleFactory } from '../../../Theme/V.Theme.util';
import { TextAlignType, TextAlignVerticalType } from '../../../types/react.types';
import { flexView, IFlexProps } from '../../Layout/Flex/V.Flex.util';

import { VRunningLine } from '../RunningLine';

export interface IVTextStyleProps {
  color?: ColorValue;
  font?: TVThemeFont;
  // lineHeight
  lh?: number | string;
  // letterSpacing
  ls?: number | string;
  // textAlign
  ta?: TextAlignType;
  // textAlignVertical
  tav?: TextAlignVerticalType;
}

export interface IVTextProps extends TextProps, IFlexProps, IVTextStyleProps {
  scalable?: boolean;
  bold?: boolean;
  runningLine?: boolean;
  duration?: number;
  endDelay?: number;
  startDelay?: number;
  text?: React.ReactNode;
}

@flexView()
@observer
export class VText extends React.Component<IVTextProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVTextProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get style(): StyleProp<TextStyle> {
    const {
      scalable, bold, style, color, lh, ta, tav, ls, animated, font,
    } = this.props;
    const SS = (animated ? getStyleNoCache : getStyle)(style, scalable, color, lh, ta, tav, ls, bold);
    const theme = this.theme.font[font!];
    return theme ? [theme, SS.style] : SS.style;
  }

  public render() {
    const propsNoPeers = this.props;
    const {
      text, children, scalable, bold, runningLine, style, color, lh, ta, tav, ls, animated, ...props
    } = propsNoPeers;
    const Component: React.ComponentType<any> = runningLine ? VRunningLine : animated ? Animated.Text : RNText;
    const _children = text ?? children;

    return (
      <Component style={this.style} {...props}>{_children}</Component>
    );
  }
}


const getStyleNoCache = (
  style: StyleProp<ViewStyle>, scalable?: boolean, color?: ColorValue,
  lh?: number | string, ta?: TextAlignType, tav?: TextAlignVerticalType, ls?: number | string, bold?: boolean,
) => {
  const needChangeStyle = scalable || color || lh || ta || ls || bold;
  if (!needChangeStyle) return { style };

  const textStyleSource = resolveTextStyleProps({ color, lh, ls, ta, tav });
  const origin = textStyleSource ? textStyleSource.fontSize : undefined;
  const styleSource = StyleSheet.flatten(style) as TextStyle;
  const overridden = styleSource.fontSize;
  const fontSize = overridden || origin;
  const scaledFontSize = scalable && fontSize ? fontSize * fontScaleFactor : fontSize;

  return StyleSheet.create({
    style: {
      ...styleSource,
      ...textStyleSource,
      ...(fontSize ? { fontSize: scaledFontSize } : undefined),
      ...(bold ? { fontWeight: 'bold' } : undefined),
    },
  });
};

const getStyle = styleFactory(getStyleNoCache);

// Создать объект стилей RN по параметрам TextStyleProps
export function resolveTextStyleProps(props: IVTextStyleProps, style?: StyleProp<ViewStyle>) {
  const { color, lh: lineHeight, ls: letterSpacing, ta: textAlign, tav: textAlignVertical } = props;
  const styleSource = StyleSheet.flatten(style) as TextStyle;

  return {
    ...styleSource,
    ...(color ? { color } : undefined),
    ...(lineHeight ? { lineHeight } : undefined),
    ...(textAlign ? { textAlign } : undefined),
    ...(textAlignVertical ? { textAlignVertical } : undefined),
    ...(letterSpacing != null ? { letterSpacing } : undefined),
  };
}
