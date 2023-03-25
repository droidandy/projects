import { IVSortXModel } from '@invest.wl/common';
import { EDSortDirection, IoC } from '@invest.wl/core';
import { VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VThemeUtil } from '../../../../../Theme/V.Theme.util';
import { VButton } from '../../../../Input/Button/V.Button.component';
import { VSelect } from '../../../../Input/Select';
import { VCol } from '../../../../Layout/Flex';
import { VText } from '../../../Text';
import { VSortProps } from '../V.Sort.types';

export interface VSortItemProps<C = undefined> extends VSortProps<IVSortXModel<any>, C> {
}

@observer
export class VSortItem extends React.Component<VSortItemProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: VSortItemProps) {
    super(props);
    makeObservable(this);
  }

  @computed
  private get optionList() {
    return this.props.model.config.list;
  }

  public render() {
    const { model: { config, domain }, context, onConfirm, ...flexProps } = this.props;
    const theme = this.theme.kit.Filter;

    return (
      <VCol {...flexProps}>
        {!!config.title && (
          <VText mb={theme.title.sMargin?.md} style={theme.title.fText}
            color={VThemeUtil.colorPick(theme.title.cText)}>{config.title}</VText>
        )}
        <VSelect.Radio data={this.optionList} selected={domain.dto} onChange={this._valueSet} />
        {!!onConfirm &&
        <VButton.Fill context={context} onPress={onConfirm} mt={theme.button.sMargin?.md}>Применить</VButton.Fill>}
      </VCol>
    );
  }

  private _valueSet = (v: EDSortDirection) => this.props.model.domain.lvSet(v);
}
