import * as React from 'react';
import { IVFlexProps, VFlex } from './V.Flex.component';

type Props = IVFlexProps;

export class VRow extends React.PureComponent<Props> {
  public static defaultProps: Partial<Props> = {
    row: true,
  };

  public render() {
    return (
      <VFlex {...this.props} />
    );
  }
}
