import { VFilterXComposeDateModel } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { DDatePeriodModel } from '@invest.wl/domain';
import { VDatePeriodModel, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { action, computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { VThemeUtil } from '../../../../../Theme/V.Theme.util';
import { VSelectPeriod } from '../../../../Input/Select/Period';
import { IVSelectData } from '../../../../Input/Select/V.Select.types';
import { VCol } from '../../../../Layout/Flex';
import { VText } from '../../../Text';
import { IVFilterProps } from '../V.Filter.types';

export interface VFilterDateProps extends IVFilterProps<VFilterXComposeDateModel> {
}

@observer
export class VFilterComposeDate extends React.Component<VFilterDateProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @computed
  private get optionList() {
    return ((this.props.model.config.domain.dto || [])
      .filter(c => Array.isArray(c.value)) as IVSelectData<Date[]>)
      .map(opt => ({
        ...opt,
        value: new VDatePeriodModel(new DDatePeriodModel([moment(opt.value![0]), moment(opt.value![1])])),
      }));
  }

  constructor(props: VFilterDateProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  public get selected() {
    const { model: { domain: { from, to } } } = this.props;
    if (!from?.dto || !to?.dto) return;
    return new VDatePeriodModel(new DDatePeriodModel([moment(from.dto), moment(to.dto)]));
  }

  public render() {
    const theme = this.theme.kit.Filter;
    const {
      model: { config, domain: { from, to } }, inModal, onSelect, ...flexProps
    } = this.props;
    if (!from || !to) return null;

    return (
      <VCol {...flexProps}>
        {!inModal && !!config.title && (
          <VText mb={theme.title.sMargin?.md} style={theme.title.fText}
            color={VThemeUtil.colorPick(theme.title.cText)}>{config.title}</VText>
        )}
        <VSelectPeriod custom={config.domain.input} selected={this.selected} data={this.optionList}
          onChange={this.setPeriod} nullable={'Нет периода'} />
      </VCol>
    );
  }

  @action.bound
  public setPeriod(period?: VDatePeriodModel) {
    const { to, from } = this.props.model.domain;
    if (!to || !from) return;
    from.lvSet(period?.domain.from.toDate());
    to.lvSet(period?.domain.to.toDate());
    this.props.onSelect?.(period);
  }
}
