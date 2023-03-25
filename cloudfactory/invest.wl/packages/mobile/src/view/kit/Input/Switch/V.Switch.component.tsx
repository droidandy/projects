import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { ColorValue, Switch as RNSwitch, SwitchProps } from 'react-native';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { IVFlexProps } from '../../Layout/Flex';
import { flexView } from '../../Layout/Flex/V.Flex.util';

export interface IVSwitchViewProps<C = undefined> extends SwitchProps, Omit<IVFlexProps, 'children'> {
  value?: boolean;
  disabled?: boolean;
  context?: C;
  onValueChange?(value?: boolean, context?: C): void;
}

@flexView()
@observer
export class VSwitch<C = undefined> extends React.Component<IVSwitchViewProps<C>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVSwitchViewProps<C>) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const props = this.props;

    return (
      <RNSwitch thumbColor={VThemeUtil.colorPick(this.thumbColor)} trackColor={this.trackColor}
        {...props} onValueChange={this._onValueChange} />
    );
  }

  @action.bound
  private _onValueChange(value?: boolean): void {
    const { onValueChange, context } = this.props;
    onValueChange?.(value, context);
  }

  @computed
  private get thumbColor() {
    const theme = this.theme.kit.Switch.thumb;
    const { disabled, value } = this.props;
    if (disabled) return theme.cDisabled;
    return value ? theme.cActive : theme.cInactive;
  }

  @computed
  private get trackColor(): { false: ColorValue; true: ColorValue } {
    const { disabled } = this.props;
    const theme = this.theme.kit.Switch.track;
    return !disabled
      ? { false: theme.cInactive as ColorValue, true: theme.cActive as ColorValue }
      : { false: theme.cDisabled as ColorValue, true: theme.cDisabled as ColorValue };
  }
}
