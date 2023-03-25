import { IoC } from '@invest.wl/core';
import { TVThemeFont, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { comparer, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { StyleSheet } from 'react-native';
import TextInputMask, { TextInputMaskProps } from 'react-native-text-input-mask';
import { flexView, IFlexProps } from '../../Layout/Flex/V.Flex.util';
import { IVInputTextProps } from './V.InputText.component';

export interface IVInputTextMaskProps extends TextInputMaskProps, IFlexProps {
  color?: string;
  font?: TVThemeFont;
  guarded?: boolean;
}

@flexView()
@observer
export class VInputTextMask extends React.Component<IVInputTextMaskProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVInputTextProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { style, color, font, guarded, value, ..._props } = this.props;

    return (
      <TextInputMask
        secureTextEntry={guarded}
        style={this._style.style}
        value={value ?? ''}
        {..._props}
      />
    );
  }

  @computed({ equals: comparer.shallow })
  private get _styleProps() {
    const props = this.props;
    return {
      color: props.color,
      font: props.font,
      style: props.style,
    };
  }

  @computed
  private get _style() {
    const src = this._styleProps;
    const textStyleSource = src.font ? this.theme.font[src.font] : undefined;
    const styleSource = StyleSheet.flatten(src.style);
    const height = styleSource.height;
    return StyleSheet.create({
      style: {
        color: src.color,
        ...textStyleSource,
        ...styleSource,
        height,
      },
    });
  }
}
