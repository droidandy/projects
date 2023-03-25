import { TObject } from '@invest.wl/core';
import { ILambda } from '../../reactive/LambdaX';

export interface IVModalModel<C = any, P extends TObject<C> = {}> {
  inViewPort: boolean;
  context?: C;
  readonly isVisible: boolean;
  readonly isDisabled: boolean;
  readonly props: { onClose: () => void; onBackdropPress: () => void; onModalShow: () => void; onModalHide: () => void; onBackButtonPress: () => void; isVisible: boolean };
  setVisible(isVisible: ILambda<boolean>): void;
  close(): void;
  open(context?: C): void;
  toggle(context?: C): void;
  whenClose(): Promise<void> & { cancel(): void };
  setDisabled(isDisabled: ILambda<boolean>): void;
  setProps(props: ILambda<P | undefined>): void;
}
