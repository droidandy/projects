import { ReactUtils } from '@effectivetrade/effective-mobile/src/view/reactUtils/reactUtils.helper';
import { observer } from 'mobx-react';
import * as React from 'react';
import { VSpinner } from '../../../Feedback/V.Spinner.component';
import { IVFlexProps } from '../../../Layout/Flex';

export interface IVButtonProcessingProps extends IVFlexProps {
  processing?: boolean;
  color?: string;
  peers?: React.ReactNode;
}

@observer
export class VButtonProcessing extends React.Component<IVButtonProcessingProps> {
  public render() {
    const { peers, processing, children, color, ...props } = this.props;
    const custom = ReactUtils.findElementByType(peers, VButtonProcessing);

    if (processing) return <VSpinner color={color} size={'small'} {...props} {...custom?.props} />;
    return (children || null);
  }
}
