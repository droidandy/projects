import { Insets, LayoutChangeEvent, StyleProp, TouchableWithoutFeedbackProps, ViewStyle } from 'react-native';
import { IVFlexProps } from '../../Layout';

export interface IVTouchablePropsBase<T = undefined> extends Omit<TouchableWithoutFeedbackProps, 'onPress' | 'onLongPress' | 'onPressIn' | 'onPressOut' | 'onLayout'> {
  context?: T;
  hitSlop?: Insets;
  disabled?: boolean;
  activeOpacity?: number;
  // порядковый номер элемента в списке. нужен для onLayout
  index?: number;
  // Включает реализацию кнопки из react-native-gesture-handler. Не работает hitSlop.
  // Данные кнопки НЕ работают (by default) в модальных окнах.
  // https://docs.swmansion.com/react-native-gesture-handler/docs/#usage-with-modals-on-android
  // НО даже при этом ModalBottom плохо перехватывает события закрытия
  fast?: boolean;
  onPress?(context: T): any | Promise<any>;
  onLongPress?(context: T): any;
  onPressIn?(): any;
  onPressOut?(): any;
  onLayout?(event: LayoutChangeEvent, index?: number): void;
}

export interface IVTouchableFastProps {
  shouldActivateOnStart?: boolean;
  disallowInterruption?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  nativeID?: string;
}

export interface IVTouchableProps<T = any> extends IVTouchablePropsBase<T>, Omit<IVFlexProps, 'children' | 'onLayout'> {
}
