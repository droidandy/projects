import { ToggleX } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { VThemeUtil } from '@invest.wl/mobile';
import { ISKeyboardStore, SKeyboardStoreTid } from '@invest.wl/system';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import isEqual from 'lodash/isEqual';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { TextStyle } from 'react-native';
import { VCol } from '../../../Layout/Flex';
import { IFlexProps } from '../../../Layout/Flex/V.Flex.util';
import { VModalBottom } from '../../../Layout/Modal/component/V.ModalBottom.component';
import { VText } from '../../../Output/Text';
import { VInputFake } from '../../InputField';
import { VTouchable } from '../../Touchable/V.Touchable.component';
import { VSelectRadio } from '../Radio';
import { IVSelectProps, TVSelectValue } from '../V.Select.types';

export interface IVSelectDropdownProps<V> extends IVSelectProps<V>, IFlexProps {
  placeholder?: string;
  title: string;
  nullableName?: string;
  textStyle?: TextStyle;
  withoutBorder?: boolean;
  reverse?: boolean;
  line?: boolean;
}

@observer
export class VSelectDropdown<V extends TVSelectValue> extends React.Component<IVSelectDropdownProps<V>> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private keyboard = IoC.get<ISKeyboardStore>(SKeyboardStoreTid);

  private toggle = new ToggleX();

  constructor(props: IVSelectDropdownProps<V>) {
    super(props);
    makeObservable(this);
  }

  @observable private _selectedTemp?: V;
  @computed
  public get selectedTemp(): V | undefined {
    return this.props.data.find(i => isEqual(i.value, this._selectedTemp))?.value;
  };

  @computed
  public get selectedCurrent() {
    return this.props.data.find(i => isEqual(i.value, this.props.selected));
  }

  @computed
  public get selected() {
    return this.selectedTemp ?? this.selectedCurrent?.value;
  }

  public render() {
    const {
      data, title, nullable, placeholder, disabled, nullableName, reverse,
      selected, onChange, children, textStyle, withoutBorder, line, ...flexProps
    } = this.props;
    const name = this.selectedCurrent?.name ?? nullableName;
    const theme = this.theme.kit.Select.Dropdown;

    return (
      <VCol {...flexProps}>
        {!!children
          ? <VTouchable.Opacity onPress={this._openDropdown}>{children}</VTouchable.Opacity>
          : (
            <VInputFake placeholder={placeholder} value={name} onPress={this._openDropdown}
              disabled={disabled} textStyle={textStyle} withoutBorder={withoutBorder} />
          )}
        <VModalBottom isVisible={this.toggle.isOpen} onClose={this.toggle.close} isSwipeClose>
          <VModalBottom.Header>
            <VText pa={theme.sPadding?.md} style={theme.header.fTitle}>{title}</VText>
          </VModalBottom.Header>
          <VModalBottom.Body>
            {line && (
              <VCol mh={theme.body.line.sPadding?.md}
                borderWidth={theme.body.line.sBorder?.md} borderColor={VThemeUtil.colorPick(theme.body.line.cBorder)} />
            )}
            <VSelectRadio ph={theme.body.sPadding?.md} pb={line ? undefined : theme.body.sPadding?.md}
              nullable={nullable}
              onChange={this._onSelect} selected={this.selected} data={data} reverse={reverse} />
            {line && (
              <VCol mh={theme.body.line.sPadding?.md} mb={theme.body.line.sPadding?.md}
                borderWidth={theme.body.line.sBorder?.md} borderColor={VThemeUtil.colorPick(theme.body.line.cBorder)} />
            )}
          </VModalBottom.Body>
        </VModalBottom>
      </VCol>
    );
  }

  @action.bound
  private _onSelect(selected: V) {
    this._selectedTemp = selected;
    this._onClose();
  }

  private _openDropdown = () => {
    this.keyboard.dismiss();
    this.toggle.open();
  };

  @action
  private _onClose = () => {
    if (!isEqual(this.selectedTemp, this.selectedCurrent?.value)) {
      this.props.onChange(this.selectedTemp);
      this._selectedTemp = undefined;
      this.toggle.close();
    }
  };
}
