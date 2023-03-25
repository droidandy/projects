import * as React from 'react';
import { VIcon } from '../../Output/Icon';
import { IVButtonProps, VButton } from '../Button';

type Props = IVButtonProps;

export class VInputButtonHintRight extends React.PureComponent<Props> {
  public static buttonTypeCondition = (e: React.ReactElement) => BUTTON_SUB_TYPES.includes(e.type);

  public static SmallQuestion = (props: Props) => (
    <VInputButtonHintRight {...props}>
      <VIcon name={'info'} fontSize={8} color={props.color} />
    </VInputButtonHintRight>
  );

  public render() {
    return (
      <VButton.Text {...this.props} />
    );
  }
}

const BUTTON_SUB_TYPES = Object.values(VInputButtonHintRight);
