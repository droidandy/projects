import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VThemeUtil } from '../../../Theme/V.Theme.util';

import { IVFlexProps } from '../Flex';
import { flexView } from '../Flex/V.Flex.util';

@flexView()
@observer
export class VContainer extends React.Component<IVFlexProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @computed
  private get style(): ViewStyle {
    const theme = this.theme.kit.Container;

    return { flex: 1, backgroundColor: VThemeUtil.colorPick(theme.cBg) };
  }

  constructor(props: IVFlexProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { children, style } = this.props;

    return (
      <SafeAreaView style={[this.style, style]}>
        {children}
      </SafeAreaView>
    );
  }
}

