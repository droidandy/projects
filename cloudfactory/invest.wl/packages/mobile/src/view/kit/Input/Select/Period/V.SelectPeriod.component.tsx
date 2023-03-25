import { ToggleX } from '@invest.wl/common';
import { EDDatePeriodEdge, IoC, TDDatePeriodUnitCustom } from '@invest.wl/core';
import { DDatePeriodModel } from '@invest.wl/domain';
import { VDatePeriodModel, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import isEqual from 'lodash/isEqual';
import { action, computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { VThemeUtil } from '../../../../Theme/V.Theme.util';
import { VCol, VRow } from '../../../Layout/Flex';
import { IFlexProps } from '../../../Layout/Flex/V.Flex.util';
import { VModalBottom } from '../../../Layout/Modal/component/V.ModalBottom.component';
import { VText } from '../../../Output/Text';
import { VButton } from '../../Button/V.Button.component';
import { VDatePicker } from '../../DatePicker';
import { VSelectButton } from '../Button';
import { VSelectRadio } from '../Radio';
import { IVSelectData, IVSelectProps } from '../V.Select.types';

type TVSelectPeriodValue = VDatePeriodModel | TDDatePeriodUnitCustom;

export interface IVSelectPeriodProps extends IVSelectProps<VDatePeriodModel>, IFlexProps {
  custom?: boolean;
}

@observer
export class VSelectPeriod extends React.Component<IVSelectPeriodProps> {
  public static edgeList = [
    { name: 'От', value: EDDatePeriodEdge.Start },
    { name: 'До', value: EDDatePeriodEdge.End },
  ];

  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _toggler = new ToggleX();

  @observable private _edgeCurrent = EDDatePeriodEdge.Start;
  @observable private _customFrom: Date = moment().startOf('month').toDate();
  @observable private _customTo: Date = new Date();

  @computed
  public get data() {
    const { data, custom, nullable, selected } = this.props;
    let res: IVSelectData<TVSelectPeriodValue> = data;
    if (nullable) res = [{ name: nullable, value: undefined }, ...res];
    if (selected && !res.find(o => isEqual(o.value, selected))) {
      res = [...res, {
        name: selected.value, value: selected,
      }];
    }
    if (custom) res = [...res, { name: 'Произвольный', value: DDatePeriodModel.CUSTOM }];
    return res;
  }

  @computed
  public get dataHas() {
    return !!this.props.data.length;
  }

  constructor(props: IVSelectPeriodProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const { custom, selected, ...flexProps } = this.props;
    return (
      <VCol {...flexProps}>{this._contentRender}</VCol>
    );
  }

  @computed
  private get _contentRender() {
    const theme = this.theme.kit.Select.Period;
    if (!this.props.data.length) return this._customRender;
    return (
      <>
        <VSelectRadio data={this.data} selected={this.props.selected} onChange={this.select} />
        <VModalBottom isVisible={this._toggler.isOpen} onClose={this._toggler.close}>
          <VModalBottom.Body scrollEnabled={false}>
            <VCol pa={theme.modal.sPadding?.md}>{this._customRender}</VCol>
          </VModalBottom.Body>
        </VModalBottom>
      </>
    );
  }

  @computed
  private get _customRender() {
    const theme = this.theme.kit.Select.Period;
    return (
      <>
        <VText mb={theme.title.sMargin?.md} style={theme.modal.fText}
          color={VThemeUtil.colorPick(theme.modal.cText)}>Период</VText>
        <VSelectButton selected={this._edgeCurrent}
          onChange={this.edgeSet} data={VSelectPeriod.edgeList} />
        {this._edgeCurrent === EDDatePeriodEdge.Start && (
          <VDatePicker onChange={this._customSet} monthFormat={'full'}
            value={this._customFrom} />
        )}
        {this._edgeCurrent === EDDatePeriodEdge.End && (
          <VDatePicker onChange={this._customSet} monthFormat={'full'}
            value={this._customTo} start={this._customFrom} />
        )}
        {this.dataHas && (
          <VRow>
            <VButton.Fill onPress={this.selectCustom} flex mr={theme.button.sMargin?.md}>Принять</VButton.Fill>
            <VButton.Stroke onPress={this._toggler.close} flex>Отменить</VButton.Stroke>
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
  private select = (period?: TVSelectPeriodValue) => {
    if (period === DDatePeriodModel.CUSTOM) {
      this._toggler.open();
    } else {
      this.props.onChange(period);
      this._toggler.close();
    }
  };

  @action.bound
  public _customSet(date: Date) {
    const m = moment(date);
    if (this._edgeCurrent === EDDatePeriodEdge.Start) {
      this._customFrom = date;
      if (m.isAfter(this._customTo)) this._customTo = date;
    } else {
      this._customTo = date;
      if (m.isBefore(this._customFrom)) this._customFrom = date;
    }
    if (!this.dataHas) this.selectCustom();
  }

  @action
  private selectCustom = () =>
    this.select(new VDatePeriodModel(new DDatePeriodModel([moment(this._customFrom), moment(this._customTo)])));

  @action.bound
  private edgeSet(edge = EDDatePeriodEdge.Start) {
    this._edgeCurrent = edge;
  }
}
