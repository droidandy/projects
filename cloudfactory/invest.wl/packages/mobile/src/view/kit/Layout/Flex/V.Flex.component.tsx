import isFunction from 'lodash/isFunction';
import * as React from 'react';
import { StyleProp, View as RNView, ViewProps, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { flexViewPropsStyle, getStyle, getStyleWithoutCache, IFlexProps } from './V.Flex.util';

interface StyleProps extends IFlexProps {
  style?: StyleProp<ViewStyle>;
}

export interface IVFlexProps extends StyleProps, ViewProps {
  // Если children Flex функция, то он не создаёт свой компонент,
  // а только передаёт полученный style в эту ф-ю и возвращает результат как свой children
  // Полезно, напрмер чтобы задать width компоненту Image
  children?: React.ReactNode | ((props: { style: StyleProp<any>; restProps: any }) => React.ReactNode);
}

export class VFlex extends React.PureComponent<IVFlexProps> {
  public render() {
    const { style, animated, children, ...props } = this.props;
    // const props = this.props;
    const { styleSource, restProps } = flexViewPropsStyle(props);
    const SS = (animated ? getStyleWithoutCache : getStyle)(style, styleSource);

    if (typeof props.debug === 'string') console.log(`FlexView::render ${props.debug}`); // 🐞 ✅

    if (isFunction(children)) return children({ style: SS.style, restProps });
    const Component: React.ComponentType<any> = animated ? Animated.View : RNView;

    return (
      <Component style={SS.style} {...restProps}>{children}</Component>
    );
  }
}
