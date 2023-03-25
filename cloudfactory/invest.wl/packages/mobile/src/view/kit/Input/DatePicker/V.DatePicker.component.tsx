import { Picker } from '@davidgovea/react-native-wheel-datepicker';
import { IoC } from '@invest.wl/core';
import { IVDateI18n, VDateI18nTid } from '@invest.wl/view';
import { range } from 'lodash';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import * as React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { isDeviceNarrow } from '../../../Theme/V.Theme.util';

import { VRow } from '../../Layout/Flex';
import { IFlexProps } from '../../Layout/Flex/V.Flex.util';
import { TVDatePickerMonth } from './V.DatePicker.types';

const YEARS_NUMBER = 100;

export interface IVDatePickerProps extends IFlexProps {
  value?: Date;
  start?: Date;
  end?: Date;
  textColor?: string;
  monthFormat?: TVDatePickerMonth;
  onChange(value?: Date): void;
}

@observer
export class VDatePicker extends React.Component<IVDatePickerProps> {
  public static defaultProps: Partial<IVDatePickerProps> = {
    monthFormat: 'number',
  };

  private _dateI18n = IoC.get<IVDateI18n>(VDateI18nTid);

  constructor(props: IVDatePickerProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const {
      onChange, end, start, textColor, monthFormat, value, ...flexProps
    } = this.props;
    const years = range(this._startDate.getFullYear(), this._endDate.getFullYear() + 1);
    const isNumber = monthFormat === 'number';
    const monthFontSize = isDeviceNarrow ? isNumber ? 16 : 15 : isNumber ? 18 : 17;
    const textSizeAndroid = isDeviceNarrow ? 16 : 18;

    return (
      <VRow {...flexProps}>
        <Picker
          style={[SS.picker, isNumber ? SS.pickerDayShort : null]}
          // android hack: react-native-wheel-datepicker рендерит ячейку рекущей даты
          // месяца немного больше чем соседнюю с годом. Из-за этого линии выдеояющие текущее значение не совпадают.
          // Для этого задаем разные размеры текста
          itemSpace={25}
          {...this._textProps}
          textSize={textSizeAndroid}
          pickerData={this._displayDays}
          selectedValue={value?.getDate()}
          onValueChange={this._onDayValueChange}
        />
        <Picker
          style={SS.picker}
          // android hack: react-native-wheel-datepicker рендерит ячейку рекущей даты
          // месяца немного больше чем соседнюю с годом. Из-за этого линии выдеояющие текущее значение не совпадают.
          // Для этого задаем разные размеры текста
          itemSpace={isNumber ? 25 : 23}
          {...this._textProps}
          textSize={monthFontSize}
          pickerData={this._displayedMonths}
          selectedValue={this._monthsNames[value?.getMonth()!]}
          onValueChange={this._onMonthValueChange}
        />
        <Picker
          style={SS.picker}
          // android hack: react-native-wheel-datepicker рендерит ячейку рекущей даты
          // месяца немного больше чем соседнюю с годом. Из-за этого линии выдеояющие текущее значение не совпадают.
          // Для этого задаем разные размеры текста
          itemSpace={25}
          {...this._textProps}
          textSize={textSizeAndroid}
          pickerData={years}
          selectedValue={years.find((year) => year === value?.getFullYear())}
          onValueChange={this._onYearValueChange}
        />
      </VRow>
    );
  }

  @computed
  private get _startDate() {
    let { start } = this.props;
    if (!start) start = moment(this._endDate).subtract(YEARS_NUMBER, 'years').toDate();
    return start;
  }

  @computed
  private get _endDate() {
    let { end } = this.props;
    if (!end) {
      end = new Date();
      end.setHours(0, 0, 0, 0);
    }
    return end;
  }

  @computed
  private get _displayDays() {
    const date = moment(this.props.value);
    let days = range(1, date.daysInMonth() + 1);
    if (date.isSame(this._endDate, 'month')) days.splice(this._endDate.getDate());
    if (date.isSame(this._startDate, 'month')) days = days.slice(this._startDate.getDate() - 1);

    return days;
  }

  @computed
  private get _monthsNames() {
    switch (this.props.monthFormat) {
      case 'full':
        return this._dateI18n.monthFull;
      case 'short':
        return this._dateI18n.monthShort;
      case 'number':
      default:
        return this._dateI18n.monthNumber;
    }
  }

  @computed
  private get _displayedMonths() {
    const date = moment(this.props.value);
    let months = range(0, 12);

    if (date.isSame(this._endDate, 'year')) months.splice(this._endDate.getMonth() + 1);
    if (date.isSame(this._startDate, 'year')) months = months.slice(this._startDate.getMonth());

    return months.map(n => this._monthsNames[n]);
  }

  @computed
  private get _textProps() {
    return Platform.select({
      ios: {
        itemStyle: {
          color: this.props.textColor,
          fontSize: isDeviceNarrow ? 16 : 18,
        },
      },
      android: {
        textColor: this.props.textColor,
      },
    });
  }

  private _onDayValueChange = (v: string) => {
    let newDate = moment(this.props.value).date(parseInt(v, 10)).toDate();

    if (newDate < this._startDate) newDate = this._startDate;
    else if (newDate > this._endDate) newDate = this._endDate;
    else newDate.setHours(0, 0, 0, 0);

    this.props.onChange(newDate);
  };

  private _onMonthValueChange = (v: string) => {
    const monthNumber = this._monthsNames.findIndex(month => v === month);
    let newDate = moment(this.props.value).month(monthNumber).toDate();

    if (newDate < this._startDate) newDate = this._startDate;
    else if (newDate > this._endDate) newDate = this._endDate;
    else newDate.setHours(0, 0, 0, 0);

    this.props.onChange(newDate);
  };

  private _onYearValueChange = (v: number) => {
    let newDate = moment(this.props.value).year(v).toDate();

    if (newDate < this._startDate) newDate = this._startDate;
    else if (newDate > this._endDate) newDate = this._endDate;
    else newDate.setHours(0, 0, 0, 0);

    this.props.onChange(newDate);
  };
}

const SS = StyleSheet.create({
  picker: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  pickerDayShort: {
    width: 30,
    backgroundColor: 'transparent',
  },
});
