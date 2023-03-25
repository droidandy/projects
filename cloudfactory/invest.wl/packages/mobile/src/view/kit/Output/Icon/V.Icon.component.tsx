import { IoC } from '@invest.wl/core';
import { IVIconConfig, VIconConfigTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { createIconSet } from 'react-native-vector-icons';
import { flexView } from '../../Layout/Flex/V.Flex.util';

import { IVIconViewProps } from './V.Icon.types';

@flexView()
@observer
export class VIcon extends React.Component<IVIconViewProps> {
  private static _IconComponent?: any;

  private _cfg = IoC.get<IVIconConfig>(VIconConfigTid);

  constructor(props: IVIconViewProps) {
    super(props);
    makeObservable(this);
    if (!VIcon._IconComponent) {VIcon._IconComponent = createIconSet(this._cfg.map, 'glyph-icon-font', 'glyph-icon-font.ttf');}
  }

  private _root: any;

  @computed
  private get _style() {
    const { style, fontSize } = this.props;

    return StyleSheet.create({
      style: {
        ...StyleSheet.flatten(style) as ViewStyle,
        ...(fontSize ? { fontSize } : undefined),
      },
    });
  }

  // для использования анимаций
  public setNativeProps = (nativeProps: any) => {
    this._root.setNativeProps(nativeProps);
  };

  public render() {
    if (!VIcon._IconComponent) return null;
    const { style, fontSize, color, ...props } = this.props;
    return <VIcon._IconComponent style={this._style.style} color={color as string} {...props} ref={this.setRoot} />;
  }

  private setRoot = (ref: any) => {
    this._root = ref;
  };
}
