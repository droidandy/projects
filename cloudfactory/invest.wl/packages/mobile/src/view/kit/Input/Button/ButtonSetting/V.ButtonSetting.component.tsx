import { IoC } from '@invest.wl/core';
import { TVIconName, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import * as React from 'react';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';
import { IVFlexProps, VRow } from '../../../Layout/Flex';
import { VIcon } from '../../../Output/Icon';
import { VText } from '../../../Output/Text';

import { VTouchable } from '../../Touchable';
import { IVButtonModelProps } from '../V.Button.types';

export interface IVButtonSettingProps<C = any> extends IVButtonModelProps<C>, IVFlexProps {
  text?: string;
  icon?: TVIconName;
}

@observer
export class VButtonSetting<C = any> extends React.Component<IVButtonSettingProps<C>> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { text, icon, disabled, children, ...flexProps } = this.props;
    const theme = this._theme.kit.Button.Setting;
    const disabledColor = this._theme.kit.Button.cDisabled;

    return (
      <VTouchable.Opacity borderWidth={theme.sBorder?.md} borderColor={VThemeUtil.colorPick(theme.cBorder)}
        radius={theme.sRadius?.md} bg={VThemeUtil.colorPick(theme.cBg)} disabled={disabled}
        minHeight={theme.sHeight?.md} ph={theme.sPadding?.md} justifyContent={'center'} {...flexProps}>
        <VRow justifyContent={'space-between'} alignItems={'center'}>
          {!!icon && (
            <VIcon mr={theme.icon.sMargin?.md} name={icon} color={VThemeUtil.colorPick(theme.icon.cMain)}
              fontSize={theme.icon.sFont?.md} />
          )}
          {!!children ? children : (
            <VText style={theme.fText} flex color={VThemeUtil.colorPick(disabled ? disabledColor : theme.cText)}
            >{text || ''}</VText>
          )}
          <VIcon name={'arrow-dropdown'} color={VThemeUtil.colorPick(theme.icon.cBorder)} fontSize={theme.icon.sFont?.md}
            rotate={'-90deg'} />
        </VRow>
      </VTouchable.Opacity>
    );
  }
}
