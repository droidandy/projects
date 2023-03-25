import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ActivityIndicator, ActivityIndicatorProps, StyleSheet } from 'react-native';
import { VThemeUtil } from '../../Theme/V.Theme.util';
import { IVFlexProps } from '../Layout/Flex';
import { flexView } from '../Layout/Flex/V.Flex.util';

interface Props extends IVFlexProps, ActivityIndicatorProps {
  size?: 'small' | 'large';
  color?: string;
  center?: boolean;
}

@flexView()
@observer
export class VSpinner extends React.Component<Props> {
  public static defaultProps = {
    size: 'small',
  };

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const theme = this.theme.kit.Spinner;

    const { center, style, color, ...props } = this.props;
    return (
      <ActivityIndicator style={[style, this.props.center ? SS.center : undefined]}
        color={color || VThemeUtil.colorPick(theme.cMain)} {...props} />
    );
  }
}

const SS = StyleSheet.create({
  center: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateY: -10 }, { translateX: -10 }] },
});
