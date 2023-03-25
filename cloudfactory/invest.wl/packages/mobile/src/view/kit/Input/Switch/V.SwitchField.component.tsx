import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { VCol, VRow } from '../../Layout/Flex';
import { VText } from '../../Output/Text';
import { IVSwitchViewProps, VSwitch } from './V.Switch.component';

export interface IVSwitchFieldProps<C = undefined> extends IVSwitchViewProps<C> {
  title: string;
}

@observer
export class VSwitchField<C = undefined> extends React.Component<IVSwitchFieldProps<C>> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const { title, value, onValueChange, context, disabled, ...flexProps } = this.props;
    const theme = this._theme.kit.SwitchField;

    return (
      <VCol borderBottomWidth={theme.sBorder?.md} borderColor={VThemeUtil.colorPick(theme.cBorder)}
        bg={VThemeUtil.colorPick(theme.cBg)} {...flexProps}>
        <VRow justifyContent={'space-between'} alignItems={'center'} height={theme.sHeight?.md} mv={theme.sMargin?.md}>
          <VText style={theme.fText} flex color={VThemeUtil.colorPick(theme.cText)}>{title}</VText>
          <VSwitch context={context} value={value} disabled={disabled} onValueChange={onValueChange} />
        </VRow>
      </VCol>
    );
  }
}
