import * as React from 'react';
import { VIcon } from '../../Output/Icon';
import { IVButtonProps, VButton } from '../Button';

type Props = IVButtonProps;

export class VInputRightButton extends React.Component<Props> {
  public static buttonTypeCondition = (e: React.ReactElement) => [VInputRightButton, ...BUTTON_SUB_TYPES].includes(e.type);

  public static Info = (props: Props) => (
    <VInputRightButton {...props}>
      <VIcon fontSize={16} name={'info'} />
    </VInputRightButton>
  );

  public static Close = (props: Props) => (
    <VInputRightButton {...props}>
      <VIcon fontSize={12} name={'close'} />
    </VInputRightButton>
  );

  public static Watch = (props: Props) => (
    <VInputRightButton {...props}>
      <VIcon fontSize={16} name={'eye'} />
    </VInputRightButton>
  );

  public render() {
    return (
      <VButton.Text {...this.props} />
    );
  }
}

const BUTTON_SUB_TYPES = Object.values(VInputRightButton);
