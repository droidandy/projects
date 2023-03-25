import { VFilterXDateModel } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VThemeUtil } from '../../../../../Theme/V.Theme.util';
import { VSelectRadio } from '../../../../Input/Select/Radio';
import { IVSelectData } from '../../../../Input/Select/V.Select.types';
import { VCol } from '../../../../Layout/Flex';
import { VText } from '../../../Text';
import { IVFilterProps } from '../V.Filter.types';

export interface VFilterDateProps extends IVFilterProps<VFilterXDateModel> {
}

@observer
export class VFilterDate extends React.Component<VFilterDateProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @computed
  private get optionList() {
    return (this.props.model.config.domain.dto || [])
      .filter(c => c.value instanceof Date) as IVSelectData<Date>;
  }

  constructor(props: VFilterDateProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const theme = this.theme.kit.Filter;
    const { model: { config, domain }, inModal, onSelect, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        {!inModal && !!config.title && (
          <VText mb={theme.title.sMargin?.md} style={theme.title.fText}
            color={VThemeUtil.colorPick(theme.title.cText)}>{config.title}</VText>
        )}
        {!!this.optionList?.length && (
          <VSelectRadio data={this.optionList} selected={domain.dto} onChange={this._onSelect} />
        )}
      </VCol>
    );
  }

  private _onSelect = (v: Date) => {
    this.props.model.domain.lvSet(v);
    this.props.onSelect?.(v);
  };
}
