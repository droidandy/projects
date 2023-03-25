import { DisposableHolder, VFilterXNumberModel } from '@invest.wl/common';
import { IoC } from '@invest.wl/core';
import { DInputNumberModel } from '@invest.wl/domain';
import { VInputNumberModel, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { computed, makeObservable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { VThemeUtil } from '../../../../../Theme/V.Theme.util';
import { VInputField } from '../../../../Input/InputField';
import { VSelectRadio } from '../../../../Input/Select/Radio';
import { IVSelectData } from '../../../../Input/Select/V.Select.types';
import { VCol } from '../../../../Layout/Flex';
import { VText } from '../../../Text';
import { IVFilterProps } from '../V.Filter.types';

export interface IVFilterNumberProps extends IVFilterProps<VFilterXNumberModel> {
}

@observer
export class VFilterNumber extends React.Component<IVFilterNumberProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);
  private _numberModel = new VInputNumberModel(new DInputNumberModel());
  private _dH = new DisposableHolder();

  constructor(props: IVFilterNumberProps) {
    super(props);
    makeObservable(this);
  }

  public componentDidMount() {
    const { config, domain } = this.props.model;
    if (config.domain.input) {
      this._numberModel.onChange(domain.dto);
      this._dH.push(reaction(() => domain.dto, this._numberModel.onChange));
      this._dH.push(reaction(() => this._numberModel.domain.value, (v) => {
        domain.lvSet(v);
      }));
    }
  }

  public componentWillUnmount() {
    this._dH.dispose();
  }

  @computed
  private get optionList() {
    return (this.props.model.config.domain.dto || [])
      .filter(c => typeof c.value === 'number') as IVSelectData<number>;
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
          <VInputField error={this._numberModel.displayErrors}>
            <VInputField.Input value={this._numberModel.value} {...this._numberModel.inputEvents} />
            <VInputField.Clear />
          </VInputField>
        )}
        {!!this.optionList?.length && (
          <VSelectRadio mb={this.theme.space.lg} data={this.optionList} selected={domain.dto} onChange={this._onSelect}
            reverse />
        )}
      </VCol>
    );
  }

  private _onSelect = (v: number) => {
    this.props.model.domain.lvSet(v);
    this.props.onSelect?.(v);
  };
}
