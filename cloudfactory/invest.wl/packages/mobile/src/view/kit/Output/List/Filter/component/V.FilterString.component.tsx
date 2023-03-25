import { VFilterXStringModel } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VThemeUtil } from '../../../../../Theme/V.Theme.util';
import { VInputField } from '../../../../Input/InputField';
import { VSelectRadio } from '../../../../Input/Select/Radio';
import { IVSelectData } from '../../../../Input/Select/V.Select.types';
import { VCol } from '../../../../Layout/Flex';
import { VText } from '../../../Text';
import { IVFilterProps } from '../V.Filter.types';

export interface VFilterStringProps extends IVFilterProps<VFilterXStringModel> {
}

@observer
export class VFilterString extends React.Component<VFilterStringProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  @computed
  private get optionList() {
    return (this.props.model.config.domain.dto || [])
      .filter(c => typeof c.value === 'string') as IVSelectData<string>;
  }

  constructor(props: VFilterStringProps) {
    super(props);
    makeObservable(this);
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
        {!!config.domain.input && (
          <VInputField>
            <VInputField.Input value={domain.dto} onChangeText={this._valueSet} />
            <VInputField.Clear />
          </VInputField>
        )}
        {!!this.optionList?.length && (
          <VSelectRadio data={this.optionList} selected={domain.dto} onChange={this._valueSet} />
        )}
      </VCol>
    );
  }

  private _valueSet = (v: string) => {
    this.props.model.domain.lvSet(v);
    this.props.onSelect?.(v);
  };
}
