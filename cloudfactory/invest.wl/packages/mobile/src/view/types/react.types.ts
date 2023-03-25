import * as React from 'react';
import { FlexAlignType } from 'react-native';

export type JustifyContentType = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around'
| 'space-evenly';
export type TextAlignType = 'auto' | 'left' | 'right' | 'center' | 'justify';
export type TextAlignVerticalType = 'auto' | 'top' | 'bottom' | 'center';
export type AlignSelfType = 'auto' | FlexAlignType;
export type FlexWrapType = 'wrap' | 'nowrap' | 'wrap-reverse';
export type KeyboardAppearanceType = 'default' | 'light' | 'dark';
export type AlignContentType = 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'space-between' | 'space-around';

export enum TextStyleEnum {
  color = 'color',
  fontFamily = 'fontFamily',
  fontSize = 'fontSize',
  fontStyle = 'fontStyle',
  fontWeight = 'fontWeight',
  letterSpacing = 'letterSpacing',
  lineHeight = 'lineHeight',
  textAlign = 'textAlign',
  textDecorationLine = 'textDecorationLine',
  textDecorationStyle = 'textDecorationStyle',
  textDecorationColor = 'textDecorationColor',
  textShadowColor = 'textShadowColor',
  textShadowOffset = 'textShadowOffset',
  textShadowRadius = 'textShadowRadius',
  textTransform = 'textTransform',
  writingDirection = 'writingDirection',
  textAlignVertical = 'textAlignVertical',
  includeFontPadding = 'includeFontPadding',
}

export type ReactEntity<P = any> = React.ComponentClass<P> | React.ReactElement<P>
| ((item: any) => React.ReactElement<P>);
export type PropsExtractorType<TP> = <P extends Partial<TP>>(props: P) => { props: Partial<TP>; rest: Omit<P, keyof Partial<TP>> };
