import { Formatter, ToggleX } from '@invest.wl/common';
import { IoC, TDDatePeriodUnitCustom } from '@invest.wl/core';
import { DDatePeriodModel } from '@invest.wl/domain';
import { ISKeyboardStore, SKeyboardStoreTid } from '@invest.wl/system';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import isEqual from 'lodash/isEqual';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';

import { VCol, VRow } from '../../../Layout/Flex';
import { IFlexProps } from '../../../Layout/Flex/V.Flex.util';
import { VModalBottom } from '../../../Layout/Modal';
import { VText } from '../../../Output/Text';
import { VButton } from '../../Button';
import { VDatePicker } from '../../DatePicker';
import { VInputFake } from '../../InputField';
import { VTouchable } from '../../Touchable/V.Touchable.component';
import { VSelectRadio } from '../Radio';
import { IVSelectData, IVSelectProps } from '../V.Select.types';

type TVSelectPeriodValue = Date | TDDatePeriodUnitCustom;

export interface IVSelectDateProps extends IFlexProps, Omit<IVSelectProps<Date>, 'data'> {
  data?: IVSelectData<Date>;
  custom?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

@observer
export class VSelectDate extends React.Component<IVSelectDateProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private toggler = new ToggleX();
  private keyboard = IoC.get<ISKeyboardStore>(SKeyboardStoreTid);

  @observable private _custom = new Date();

  @computed
  public get data() {
    const { data, custom, nullable, selected } = this.props;
    if (!data) return [];
    let res: IVSelectData<TVSelectPeriodValue> = data;
    if (nullable) res = [{ name: nullable, value: undefined }, ...res];
    if (selected && !res.find(o => isEqual(o.value, selected))) {
      res = [...res, {
        name: Formatter.date(selected), value: selected,
      }];
    }
    if (custom) res = [...res, { name: 'Произвольный', value: DDatePeriodModel.CUSTOM }];
    return res;
  }

  @computed
  public get dataHas() {
    return !!this.props.data?.length;
  }

  constructor(props: IVSelectDateProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const theme = this.theme.kit.Select.Period;
    const { custom, selected, disabled, placeholder, children, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        {this.dataHas && (
          <VSelectRadio data={this.data} selected={this.props.selected} onChange={this.select} />
        )}
        {!this.dataHas && (
          !!children ?
            <VTouchable.Opacity disabled={disabled} onPress={this._openDropdown}>{children}</VTouchable.Opacity> : (
              <VInputFake placeholder={placeholder} value={selected ? Formatter.date(selected) : undefined}
                onPress={this._openDropdown} disabled={disabled} />
            )
        )}
        <VModalBottom isVisible={this.toggler.isOpen} onClose={this.toggler.close}>
          <VModalBottom.Body scrollEnabled={false}>
            <VCol pa={theme.modal.sPadding?.md}>{this._customRender}</VCol>
          </VModalBottom.Body>
        </VModalBottom>
      </VCol>
    );
  }

  @computed
  private get _customRender() {
    const theme = this.theme.kit.Select.Period;
    return (
      <>
        <VText mb={theme.sMargin?.md} style={theme.modal.fText}
          color={VThemeUtil.colorPick(theme.modal.cText)}>Дата</VText>
        <VDatePicker onChange={this._customSet} monthFormat={'full'}
          value={this._custom} />
        {this.dataHas && (
          <VRow>
            <VButton.Fill onPress={this.selectCustom} flex mr={theme.button.sMargin?.md}>Принять</VButton.Fill>
            <VButton.Stroke onPress={this.toggler.close} flex>Отменить</VButton.Stroke>
          </VRow>
        )}
        {!this.dataHas && !!this.props.nullable && (
          <VRow>
            <VButton.Stroke onPress={this.select} flex>Очистить</VButton.Stroke>
          </VRow>
        )}
      </>
    );
  }

  @action
  private select = (date?: TVSelectPeriodValue) => {
    if (date === DDatePeriodModel.CUSTOM) {
      this._openDropdown();
    } else {
      this.props.onChange(date);
      this.toggler.close();
    }
  };

  @action.bound
  public _customSet(date: Date) {
    this._custom = date;
    if (!this.dataHas) this.selectCustom();
  }

  @action
  private selectCustom = () => this.props.onChange(this._custom);

  private _openDropdown = () => {
    this.keyboard.dismiss();
    this.toggler.open();
  };
}
