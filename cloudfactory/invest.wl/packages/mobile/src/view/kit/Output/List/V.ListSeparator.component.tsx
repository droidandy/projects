import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { IVFlexProps, VCol } from '../../Layout/Flex';

export interface IVListSeparatorProps extends IVFlexProps {
}

@observer
export class VListSeparator extends React.Component<IVListSeparatorProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const theme = this.theme.kit.ListSeparator;
    return <VCol mh={theme.sMargin?.md} height={theme.sHeight?.md} bg={VThemeUtil.colorPick(theme.cBg)} {...this.props} />;
  }
}
