import { TThemeSizeValue, TVThemeColorValue } from '@invest.wl/view';
import hoistNonReactStatics from 'hoist-non-react-statics';
import isNumber from 'lodash/isNumber';
import isString from 'lodash/isString';
import * as React from 'react';
import { ComponentType } from 'react';
import { ColorValue, FlexAlignType, FlexStyle, StyleProp, StyleSheet, TransformsStyle, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { isColor, themeSpaces } from '../../../Theme/V.Theme.util';
import { AlignContentType, AlignSelfType, FlexWrapType, JustifyContentType } from '../../../types/react.types';
import { shadowStyle } from '../../../util/style.util';

type TransformsStyleProps = TransformsStyle['transform'];

interface PaddingProps {
  paddingLeft?: number | string;
  paddingRight?: number | string;
  paddingTop?: number | string;
  paddingBottom?: number | string;
  paddingVertical?: number | string;
  paddingHorizontal?: number | string;
  padding?: number | string;
  paddingStart?: number | string;
  paddingEnd?: number | string;
}

interface MarginProps {
  marginLeft?: number | string;
  marginRight?: number | string;
  marginTop?: number | string;
  marginBottom?: number | string;
  marginVertical?: number | string;
  marginHorizontal?: number | string;
  margin?: number | string;
}

interface PaddingGridProps {
  // paddingLeft
  pl?: TThemeSizeValue;
  // paddingRight
  pr?: TThemeSizeValue;
  // paddingTop
  pt?: TThemeSizeValue;
  // paddingBottom
  pb?: TThemeSizeValue;
  // paddingVertical
  pv?: TThemeSizeValue;
  // paddingHorizontal
  ph?: TThemeSizeValue;
  // padding
  pa?: TThemeSizeValue;
}

interface MargingGridProps {
  // marginLeft
  ml?: TThemeSizeValue;
  // marginRight
  mr?: TThemeSizeValue;
  // marginTop
  mt?: TThemeSizeValue;
  // marginBottom
  mb?: TThemeSizeValue;
  // marginVertical
  mv?: TThemeSizeValue;
  // marginHorizontal
  mh?: TThemeSizeValue;
  // margin
  ma?: TThemeSizeValue;
}

interface SideProps {
  // Более короткая запись <Col left/>, вместо <Col left={0}/>
  left?: number | string | boolean;
  // Более короткая запись <Col right/>, вместо <Col right={0}/>
  right?: number | string | boolean;
  // Более короткая запись <Col top/>, вместо <Col top={0}/>
  top?: number | string | boolean;
  // Более короткая запись <Col bottom/>, вместо <Col bottom={0}/>
  bottom?: number | string | boolean;
}

interface SizeProps {
  // Более короткая запись <Row height/>, вместо <Row height={'100%'}/>
  height?: number | string | boolean;
  minHeight?: number | string;
  maxHeight?: number | string;
  // Более короткая запись <Col width/>, вместо <Col width={'100%'}/>
  width?: number | string | boolean;
  minWidth?: number | string;
  maxWidth?: number | string;
}

interface FlexLayoutProps {
  // Более короткая запись <Col flex/>, вместо <Col flex={1}/>
  flex?: number | string | boolean;
  // Более короткая запись <Col flexGrow/>, вместо <Col flexGrow={1}/>
  flexGrow?: number | string | boolean;
  // Более короткая запись <Col flexShrink/>, вместо <Col flexShrink={1}/>
  flexShrink?: number | string | boolean;
}

interface FlexDirectionProps {
  // flexDirection: 'row' (row-reverse)
  row?: boolean;
  // flexDirection: 'column' (column-reverse)
  col?: boolean;
  // flexDirection: row-reverse || column-reverse
  reverse?: boolean;
  wrap?: FlexWrapType | boolean;
}

interface AlignProps {
  alignItems?: FlexAlignType;
  alignSelf?: AlignSelfType;
  justifyContent?: JustifyContentType;
  centerContent?: boolean;
  alignContent?: AlignContentType;
}

interface PositionProps {
  // position='absolute'
  absolute?: boolean;
  absoluteFill?: boolean;
  zIndex?: number;
}

interface BorderProps {
  // borderRadius
  radius?: number | string;
  topRadius?: number | string;
  bottomRadius?: number | string;
  leftRadius?: number | string;
  rightRadius?: number | string;
  leftTopRadius?: number | string;
  leftBottomRadius?: number | string;
  rightTopRadius?: number | string;
  rightBottomRadius?: number | string;
  // circle - диаметр круга
  circle?: number;
  overflow?: 'visible' | 'hidden' | 'scroll' | boolean;
  borderColor?: ColorValue;
  borderWidth?: number;
  borderTopWidth?: number;
  borderBottomWidth?: number;
  borderLeftWidth?: number;
}

interface TransformProps {
  animated?: boolean;
  /**
   * Value for: transform: [{rotate: string}]
   * Examples: '90deg', '0.785398rad'
   */
  // @ts-ignore
  rotate?: string | Animated.Animated;
  // @ts-ignore
  translateX?: number | Animated.Animated;
  // @ts-ignore
  translateY?: number | Animated.Animated;
  // @ts-ignore
  scale?: number | Animated.Animated;
}

interface ShadowProps {
  elevation?: number;
}

interface DebugProps {
  // true - красит фон красным, 'любой текст' - выведет указанный текст в лог из render
  debug?: boolean | string;
}

interface ColorProps {
  bg?: TVThemeColorValue;
  // @ts-ignore
  opacity?: number | string | Animated.Animated;
}

export interface IFlexProps extends PaddingGridProps, MargingGridProps, SideProps, SizeProps,
  PaddingProps, MarginProps,
  FlexLayoutProps, FlexDirectionProps, AlignProps, PositionProps, DebugProps, ShadowProps,
  BorderProps, TransformProps, ColorProps {
}


export const getStyleWithoutCache = (style: StyleProp<ViewStyle>, flexViewStyle: FlexStyle) => {
  const { opacity, transform, ...styleSource } = {
    ...StyleSheet.flatten(style),
    ...flexViewStyle,
  };

  // анимированный opacity оказывается нельзя прогонять через StyleSheet.create
  const isAnimatedOpacity = !!opacity && !isNumber(opacity) && !isString(opacity);
  if (!isAnimatedOpacity) (styleSource as any).opacity = opacity;

  const result = StyleSheet.create({ style: styleSource });

  if (isAnimatedOpacity) result.style = { ...result.style, opacity } as any;
  if (transform) result.style = { ...result.style, transform } as any;
  return result;
};

// styleFactory использует кеш стилей для каждого набора пропсов,
// однако для Animated пропсов этот подход даёт сбой,
// так как разные Animated пропсы с одним значением дают один и тот же JSON,
// поэтому разные компоненты получают один объект стилей
// const getStyle = styleFactory(getStyleWithoutCache);
export const getStyle = getStyleWithoutCache;

const flexDirectionPropsStyle = (props: FlexDirectionProps, ss: ViewStyle) => {
  const { row, reverse } = props;
  let res = row ? 'row' : 'column';
  if (reverse) res += '-reverse';
  if (res !== 'column') ss.flexDirection = res as any;

  if (props.wrap) ss.flexWrap = props.wrap === true ? 'wrap' : props.wrap;
  delete props.row;
  delete props.reverse;
};

const spaceForSize = (space: TThemeSizeValue) => {
  return isNumber(space) ? space : themeSpaces[space];
};

const paddingGridPropsStyle = (props: PaddingGridProps, ss: ViewStyle) => {
  extractStyleProp(props, 'pl', IsTruth, v => ss.paddingLeft = spaceForSize(v));
  extractStyleProp(props, 'pr', IsTruth, v => ss.paddingRight = spaceForSize(v));
  extractStyleProp(props, 'pt', IsTruth, v => ss.paddingTop = spaceForSize(v));
  extractStyleProp(props, 'pb', IsTruth, v => ss.paddingBottom = spaceForSize(v));
  extractStyleProp(props, 'pv', IsTruth, v => ss.paddingVertical = spaceForSize(v));
  extractStyleProp(props, 'ph', IsTruth, v => ss.paddingHorizontal = spaceForSize(v));
  extractStyleProp(props, 'pa', IsTruth, v => ss.padding = spaceForSize(v));
};

const marginGridPropsStyle = (props: MargingGridProps, ss: ViewStyle) => {
  extractStyleProp(props, 'ml', IsTruth, v => ss.marginLeft = spaceForSize(v));
  extractStyleProp(props, 'mr', IsTruth, v => ss.marginRight = spaceForSize(v));
  extractStyleProp(props, 'mt', IsTruth, v => ss.marginTop = spaceForSize(v));
  extractStyleProp(props, 'mb', IsTruth, v => ss.marginBottom = spaceForSize(v));
  extractStyleProp(props, 'mv', IsTruth, v => ss.marginVertical = spaceForSize(v));
  extractStyleProp(props, 'mh', IsTruth, v => ss.marginHorizontal = spaceForSize(v));
  extractStyleProp(props, 'ma', IsTruth, v => ss.margin = spaceForSize(v));
};

const paddingPropsStyle = (props: PaddingProps, ss: ViewStyle) => {
  extractStyleProp(props, 'paddingLeft', NotUndefined, v => ss.paddingLeft = v);
  extractStyleProp(props, 'paddingRight', NotUndefined, v => ss.paddingRight = v);
  extractStyleProp(props, 'paddingTop', NotUndefined, v => ss.paddingTop = v);
  extractStyleProp(props, 'paddingBottom', NotUndefined, v => ss.paddingBottom = v);
  extractStyleProp(props, 'paddingVertical', NotUndefined, v => ss.paddingVertical = v);
  extractStyleProp(props, 'paddingHorizontal', NotUndefined, v => ss.paddingHorizontal = v);
  extractStyleProp(props, 'padding', NotUndefined, v => ss.padding = v);
  extractStyleProp(props, 'paddingStart', NotUndefined, v => ss.paddingStart = v);
  extractStyleProp(props, 'paddingEnd', NotUndefined, v => ss.paddingEnd = v);
};

const marginPropsStyle = (props: MarginProps, ss: ViewStyle) => {
  extractStyleProp(props, 'marginLeft', NotUndefined, v => ss.marginLeft = v);
  extractStyleProp(props, 'marginRight', NotUndefined, v => ss.marginRight = v);
  extractStyleProp(props, 'marginTop', NotUndefined, v => ss.marginTop = v);
  extractStyleProp(props, 'marginBottom', NotUndefined, v => ss.marginBottom = v);
  extractStyleProp(props, 'marginVertical', NotUndefined, v => ss.marginVertical = v);
  extractStyleProp(props, 'marginHorizontal', NotUndefined, v => ss.marginHorizontal = v);
  extractStyleProp(props, 'margin', NotUndefined, v => ss.margin = v);
};

const sizePropsStyle = (props: SizeProps, ss: ViewStyle) => {
  extractStyleProp(props, 'width', NotUndefined, v => ss.width = v === true ? '100%' : v);
  extractStyleProp(props, 'height', NotUndefined, v => ss.height = v === true ? '100%' : v);
  extractStyleProp(props, 'minHeight', NotUndefined, v => ss.minHeight = v);
  extractStyleProp(props, 'maxHeight', NotUndefined, v => ss.maxHeight = v);
  extractStyleProp(props, 'minWidth', NotUndefined, v => ss.minWidth = v);
  extractStyleProp(props, 'maxWidth', NotUndefined, v => ss.maxWidth = v);
};

const positionPropsStyle = (props: PositionProps, ss: ViewStyle) => {
  extractStyleProp(props, 'absolute', IsTruth, v => ss.position = 'absolute');
  extractStyleProp(props, 'zIndex', IsTruth, v => ss.zIndex = v);
  extractStyleProp(props, 'absoluteFill', IsTruth, v => {
    ss.position = 'absolute';
    ss.left = 0;
    ss.right = 0;
    ss.top = 0;
    ss.bottom = 0;
  });
};

const sidePropsStyle = (props: SideProps, ss: ViewStyle) => {
  extractStyleProp(props, 'left', NotUndefined, v => ss.left = v === true ? 0 : v);
  extractStyleProp(props, 'right', NotUndefined, v => ss.right = v === true ? 0 : v);
  extractStyleProp(props, 'top', NotUndefined, v => ss.top = v === true ? 0 : v);
  extractStyleProp(props, 'bottom', NotUndefined, v => ss.bottom = v === true ? 0 : v);
};

const flexPropsStyle = (props: FlexLayoutProps, ss: ViewStyle) => {
  extractStyleProp(props, 'flex', NotUndefined, v => ss.flex = v === true ? 1 : v);
  extractStyleProp(props, 'flexGrow', NotUndefined, v => ss.flexGrow = v === true ? 1 : v);
  extractStyleProp(props, 'flexShrink', NotUndefined, v => ss.flexShrink = v === true ? 1 : v);
};

const debugColor = (debug?: boolean | string) => {
  if (debug === true) return 'red';
  else if (typeof debug === 'string' && isColor(debug)) return debug;
  return undefined;
};

const NotUndefined = (v: any) => v !== undefined;
const IsTruth = (v: any) => !!v;

function extractStyleProp<P extends Record<string, any>>(props: P, key: keyof P, predicate: (v: any) => boolean, setter: (v: any) => void) {
  const value = (props as any)[key];
  if (value !== undefined) setter(value);
  delete (props as any)[key];
}

const colorPropsStyle = (props: ColorProps, ss: ViewStyle) => {
  extractStyleProp(props, 'bg', NotUndefined, v => ss.backgroundColor = v);
  // extractStyleProp(props, 'opacity', NotUndefined, v => ss.opacity = v);
};

function isFlexProp(prop: string) {
  return true;
}

export function isFlexViewPropsChanged(props1: IFlexProps, props2: IFlexProps): boolean {
  for (const prop1 in props1) {
    if (isFlexProp(prop1) && (props1 as any)[prop1] !== (props2 as any)[prop1]) {
      return true;
    }
  }
  for (const prop2 in props2) {
    if (isFlexProp(prop2) && (props1 as any)[prop2] !== (props2 as any)[prop2]) {
      return true;
    }
  }

  return false;
}

export function flexViewPropsStyle<P>(inProps: IFlexProps & P, opts?: FlexViewDecoratorOpts): { styleSource: FlexStyle; restProps: P } {
  const passProps = { ...inProps };
  // exclude
  let ignore: any;
  if (opts && opts.ignore) {
    ignore = {};
    opts.ignore.forEach(prop => {
      ignore[prop] = passProps[prop];
      delete passProps[prop];
    });
  }

  const {
    alignItems,
    alignSelf,
    justifyContent,
    centerContent,
    elevation,
    // border
    radius,
    topRadius,
    bottomRadius,
    leftRadius,
    rightRadius,
    leftTopRadius,
    leftBottomRadius,
    rightTopRadius,
    rightBottomRadius,
    circle,
    overflow,
    // transform
    rotate,
    translateX,
    translateY,
    scale,
    // border
    borderColor,
    borderWidth,
    borderBottomWidth,
    borderLeftWidth,
    opacity,

    ...props
  } = passProps;

  const ss: ViewStyle = {};

  const debugColorValue = debugColor(props.debug);
  const debug = debugColorValue ? { backgroundColor: debugColorValue } as ViewStyle : undefined;

  if (centerContent) {
    ss.alignItems = 'center';
    ss.justifyContent = 'center';
  }
  if (alignItems) {
    ss.alignItems = alignItems;
  }
  if (alignSelf) {
    ss.alignSelf = alignSelf;
  }
  if (justifyContent) {
    ss.justifyContent = justifyContent;
  }
  if (elevation !== undefined) {
    Object.assign(ss, shadowStyle(elevation));
  }

  // border
  if (circle && Number.isFinite(circle)) {
    ss.width = circle;
    ss.height = circle;
    ss.borderRadius = circle / 2;
  }
  if (radius) {
    ss.borderRadius = radius as any;
  }
  if (topRadius) {
    ss.borderTopLeftRadius = topRadius as any;
    ss.borderTopRightRadius = topRadius as any;
  }
  if (bottomRadius) {
    ss.borderBottomLeftRadius = bottomRadius as any;
    ss.borderBottomRightRadius = bottomRadius as any;
  }
  if (leftRadius) {
    ss.borderBottomLeftRadius = leftRadius as any;
    ss.borderTopLeftRadius = leftRadius as any;
  }
  if (rightRadius) {
    ss.borderBottomRightRadius = rightRadius as any;
    ss.borderTopRightRadius = rightRadius as any;
  }
  if (leftTopRadius) {
    ss.borderTopLeftRadius = leftTopRadius as any;
  }
  if (leftBottomRadius) {
    ss.borderBottomLeftRadius = leftBottomRadius as any;
  }
  if (rightTopRadius) {
    ss.borderTopRightRadius = rightTopRadius as any;
  }
  if (rightBottomRadius) {
    ss.borderBottomRightRadius = rightBottomRadius as any;
  }
  if (borderColor) {
    ss.borderColor = borderColor;
  }
  if (borderWidth) {
    ss.borderWidth = borderWidth;
  }
  if (borderBottomWidth) {
    ss.borderBottomWidth = borderBottomWidth;
  }
  if (borderLeftWidth) {
    ss.borderLeftWidth = borderLeftWidth;
  }
  if (opacity !== undefined) {
    ss.opacity = opacity as any;
  }

  if (overflow !== undefined) {
    ss.overflow = overflow === false ? 'hidden' : (overflow === true ? 'visible' : overflow);
  }
  // transform
  const transform: TransformsStyleProps = [];
  if (rotate) {
    transform.push({ rotate });
  }
  if (translateX) {
    transform.push({ translateX });
  }
  if (translateY) {
    transform.push({ translateY });
  }
  if (scale) {
    transform.push({ scale });
  }
  if (transform.length) {
    ss.transform = transform;
  }

  colorPropsStyle(props, ss);
  flexDirectionPropsStyle(props, ss);
  positionPropsStyle(props, ss);
  paddingGridPropsStyle(props, ss);
  marginGridPropsStyle(props, ss);
  paddingPropsStyle(props, ss);
  marginPropsStyle(props, ss);
  sidePropsStyle(props, ss);
  flexPropsStyle(props, ss);
  sizePropsStyle(props, ss);

  if (ignore) {
    Object.assign(props, ignore);
  }

  const styleSource = {
    ...debug,
    ...ss,
  } as FlexStyle;

  return { styleSource, restProps: props as P };
}

interface FlexViewDecoratorOpts {
  ignore?: (keyof IFlexProps)[];
}

function flexViewDecorator(opts?: FlexViewDecoratorOpts) {
  return function decorator<T extends ComponentType<any>>(Component: T): T {
    function HOCComponent(inProps: any) {
      const { style, ...props } = inProps;
      const { styleSource, restProps } = flexViewPropsStyle(props, opts);
      const SS = getStyle(style, styleSource);

      // @ts-ignore
      return (<Component style={SS.style} {...restProps} />);
    }

    hoistNonReactStatics(HOCComponent, Component);
    (HOCComponent as any).displayName = ((Component as any).displayName || (Component as any).name) + '_flexView';

    return HOCComponent as any as T;
  };
}

export const flexView = flexViewDecorator;
