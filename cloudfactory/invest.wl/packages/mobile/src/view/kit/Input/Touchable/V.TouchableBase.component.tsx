import * as React from 'react';
import { LayoutChangeEvent, StyleSheet, TouchableWithoutFeedbackProps } from 'react-native';
import { extractStyleLayout } from '../../../Theme/V.Theme.util';
import { flexView } from '../../Layout/Flex/V.Flex.util';
import { VTouchableConfig } from './V.Touchable.config';
import { IVTouchableProps } from './V.Touchable.types';

export interface IVTouchableBaseProps<T = undefined> extends IVTouchableProps<T> {
  Component: React.ComponentClass<TouchableWithoutFeedbackProps>;
  ComponentFast: any;
  // ComponentFast: React.ComponentClass<TouchableWithoutFeedbackProps & { containerStyle: StyleProp<ViewStyle> }>;
}

@flexView()
export class VTouchableBase<T = undefined> extends React.PureComponent<IVTouchableBaseProps<T>> {
  public static defaultProps: Partial<IVTouchableBaseProps> = {
    activeOpacity: VTouchableConfig.activeOpacityDefault,
  };

  public render() {
    const {
      Component, ComponentFast, fast, children, context,
      onPress, onLongPress, onLayout, ...props
    } = this.props;

    if (fast) {
      const { layoutStyle, style } = extractStyleLayout(StyleSheet.flatten(props.style));
      return (
        <ComponentFast onPress={this._onPress} onLongPress={this._onLongPress} onLayout={this._onLayout}
          {...props} containerStyle={layoutStyle}
          style={[style, { flex: layoutStyle.flex, height: layoutStyle.height, width: layoutStyle.width }]}>
          {children}
        </ComponentFast>
      );
    }

    return (
      <Component onPress={this._onPress} onLongPress={this._onLongPress} onLayout={this._onLayout} {...props}>
        {children}
      </Component>
    );
  }

  private _onPress = () => this.props.onPress?.(this.props.context as T);
  private _onLongPress = () => this.props.onLongPress?.(this.props.context as T);
  private _onLayout = (e: LayoutChangeEvent) => this.props.onLayout?.(e, this.props.index);
}
