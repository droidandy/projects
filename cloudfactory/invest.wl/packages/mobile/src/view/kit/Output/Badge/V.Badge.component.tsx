import { IoC } from '@invest.wl/core';
import { TVThemeSizeBase, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import * as React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { IVFlexProps, VCol } from '../../Layout/Flex';
import { VText } from '../Text';

export interface IVBadgeProps extends IVFlexProps {
  value?: string | number | boolean;
  size: TVThemeSizeBase;
}

@observer
export class VBadge extends React.Component<IVBadgeProps> {
  public static defaultProps = {
    size: 'md',
  };
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const theme = this._theme.kit.Badge;
    const { value, size, ...flexProps } = this.props;
    const diameter = theme.sDiameter?.[size] || 16;
    const fontSize = theme.sFont?.[size] || 10;

    if (!!value) {
      return (
        <VCol justifyContent={'center'} alignItems={'center'} radius={diameter / 2}
          ph={theme.sPadding?.[size]} minWidth={diameter} minHeight={diameter}
          bg={VThemeUtil.colorPick(theme.cBg)} {...flexProps}>
          <VText style={[theme.fText, { fontSize, lineHeight: fontSize }]} mb={-2}
            color={VThemeUtil.colorPick(theme.cText)}>
            {value}</VText>
        </VCol>
      );
    }

    return null;
  }
}
