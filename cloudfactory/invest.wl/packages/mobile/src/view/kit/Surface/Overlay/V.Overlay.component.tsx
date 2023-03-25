import * as React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { VCol } from '../../Layout/Flex';

interface Props {
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export class VOverlay extends React.PureComponent<Props> {
  public render() {
    const props = this.props;
    return (
      <VCol
        absolute
        top={0}
        bottom={0}
        left={0}
        right={0}
        zIndex={10}
        alignItems={'center'}
        justifyContent={'center'}
        bg={'black'}
        opacity={0.5}
        style={props.style}>
        {props.children}
      </VCol>
    );
  }
}
