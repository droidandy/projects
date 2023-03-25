import { VFilterXComposeStringModel } from '@invest.wl/common';
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

export interface VFilterStringProps extends IVFilterProps<VFilterXComposeStringModel> {
}

@observer
export class VFilterComposeString extends React.Component<VFilterStringProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @computed
  private get optionList() {
    return (this.props.model.config.domain.dto || [])
      .filter(c => Array.isArray(c.value)) as IVSelectData<string[]>;
  }

  constructor(props: VFilterStringProps) {
    super(props);
    makeObservable(this);
  }

  public render() {
    const theme = this.theme.kit.Filter;
    const { model: { config, domain: { from, to } }, inModal, onSelect, ...flexProps } = this.props;
    if (!from || !to) return null;
    return (
      <VCol {...flexProps}>
        {!inModal && !!config.title && (
          <VText mb={theme.title.sMargin?.md} style={theme.title.fText}
            color={VThemeUtil.colorPick(theme.title.cText)}>{config.title}</VText>
        )}
        {!!this.optionList?.length && (
          <VSelectRadio data={this.optionList} selected={[from.dto!, to.dto!]} onChange={this._valueSet} />
        )}
      </VCol>
    );
  }

  private _valueSet = (v: string[]) => {
    const { from, to } = this.props.model.domain;
    if (!from || !to) return;
    from.lvSet(v[0]);
    to.lvSet(v[1]);
    this.props.onSelect?.(v);
  };
}
