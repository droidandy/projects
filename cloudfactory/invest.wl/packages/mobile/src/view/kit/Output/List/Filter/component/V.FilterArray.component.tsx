import { VFilterXArrayModel } from '@invest.wl/common';
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

export interface IVFilterArrayProps extends IVFilterProps<VFilterXArrayModel<any>> {
}

@observer
export class VFilterArray extends React.Component<IVFilterArrayProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVFilterArrayProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get optionList() {
    return (this.props.model.config.domain.dto || [])
      .filter(c => Array.isArray(c.value)) as IVSelectData<any[]>;
  }

  public render() {
    const theme = this.theme.kit.Filter;
    const { model: { config, domain }, inModal, onSelect, ...flexProps } = this.props;

    return (
      <VCol {...flexProps}>
        {!inModal && !!config.title && (
          <VText style={theme.title.fText} mb={theme.title.sMargin?.md}
            color={VThemeUtil.colorPick(theme.title.cText)}>{config.title}</VText>
        )}
        {!!this.optionList?.length && (
          <VSelectRadio mb={this.theme.space.lg} data={this.optionList} selected={domain.dto} onChange={this._valueSet}
            reverse />
        )}
      </VCol>
    );
  }

  private _valueSet = (v: any[]) => {
    this.props.model.domain.lvSet(v);
    this.props.onSelect?.(v);
  };
}
