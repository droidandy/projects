import { IoC } from '@invest.wl/core';
import { VInputStringModel, VThemeStore, VThemeStoreTid } from '@invest.wl/view';
import { observer } from 'mobx-react';
import React from 'react';
import { VThemeUtil } from '../../../Theme/V.Theme.util';
import { IVInputFieldProps, VInputField } from '../../Input/InputField';

export interface IVNavBarInputProps extends IVInputFieldProps {
  autoFocus?: boolean;
  model: VInputStringModel;
}

@observer
export class VNavBarInput extends React.Component<IVNavBarInputProps> {
  private theme = IoC.get<VThemeStore>(VThemeStoreTid);

  public render() {
    const theme = this.theme.kit.NavBarInput;
    const { model, autoFocus, ...props } = this.props;

    return (
      <VInputField {...props}>
        <VInputField.Field minHeight={theme.sHeight?.md} bg={VThemeUtil.colorPick(theme.cBg)} />
        <VInputField.Search name={'search'} />
        <VInputField.Input autoFocus={autoFocus} placeholder={model.placeholder || 'Поиск'}
          value={model.value} {...model.inputEvents} />
        <VInputField.Clear />
      </VInputField>
    );
  }
}
