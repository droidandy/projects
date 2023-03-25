import { ModalProps as RNModalProps } from 'react-native-modal/dist/modal';
import { IFlexProps } from '../Flex/V.Flex.util';

export interface IVModalModelProps<C = undefined> extends Partial<RNModalProps> {
  readonly context?: C;
  readonly animationDuration?: number;
  readonly showCloseButton?: boolean;
  readonly useNativeDriver?: boolean;
  onClose(context: C): void;
}

export interface IVModalInternalProps<C = undefined> extends IVModalModelProps<C>, IFlexProps {
}
