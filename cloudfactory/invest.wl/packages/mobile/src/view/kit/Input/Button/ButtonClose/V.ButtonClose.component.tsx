import { IoC } from '@invest.wl/core';
import { TVIconName, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import * as React from 'react';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';
import { IVFlexProps } from '../../../Layout/Flex';
import { VIcon } from '../../../Output/Icon';
import { VButtonBase } from '../base/V.ButtonBase.component';
import { IVButtonModelProps, TVButtonSizeName } from '../V.Button.types';

export interface IVButtonCloseProps<T> extends IVFlexProps, IVButtonModelProps<T> {
  iconName?: TVIconName;
  size?: TVButtonSizeName;
  peers?: React.ReactNode;
}

@observer
export class VButtonClose<T = any> extends React.Component<IVButtonCloseProps<T>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const theme = this.theme.kit.Button.Close;

    return (
      <VButtonBase color={VThemeUtil.colorPick(theme.cBg)} width={theme.sWidth?.md}
        height={theme.sHeight?.md} radius={theme.sRadius?.md} alignSelf={'flex-end'} {...this.props}>
        <VIcon color={VThemeUtil.colorPick(theme.icon.cMain)} name={'close'} fontSize={theme.icon.sFont?.md} />
      </VButtonBase>
    );
  }
}
