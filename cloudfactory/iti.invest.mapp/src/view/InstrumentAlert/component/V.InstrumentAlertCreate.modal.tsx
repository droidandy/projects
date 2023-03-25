import React from 'react';
import { IVModalDialogProps, VButton, VCol, VInputField, VModalDialog } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { observer } from 'mobx-react';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { VInstrumentAlertSetModel } from '@invest.wl/view/src/InstrumentAlert/model/V.InstrumentAlertSet.model';

export interface IVInstrumentAlertCreateModalProps extends IVModalDialogProps {
  alert: VInstrumentAlertSetModel;
  onCreate(model: VInstrumentAlertSetModel): Promise<any>;
}

@observer
export class VInstrumentAlertCreateModal extends React.Component<IVInstrumentAlertCreateModalProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVInstrumentAlertCreateModalProps) {
    super(props);
    makeObservable(this);
  }

  @observable private _isLoading = false;

  public render() {
    const { color, space, kit } = this._theme;
    const { alert: { fields }, onCreate, ...modalProps } = this.props;

    return (
      <VModalDialog {...modalProps}>
        <VModalDialog.Title pa={space.lg} pb={0}
          text={'Уведомить по достижению цены'} />
        <VCol pa={space.lg}>
          <VInputField error={fields.targetPrice.displayErrors} label={'Целевая цена'}>
            <VInputField.Input autoFocus keyboardType={'decimal-pad'}
              value={fields.targetPrice.value} {...fields.targetPrice.inputEvents} />
          </VInputField>
        </VCol>
        <VModalDialog.Actions>
          <VButton.Stroke flex radius={0} color={color.accent1} disabled={this._isLoading}
            leftBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this.props.onClose}>Отмена</VButton.Stroke>
          <VButton.Fill flex radius={0} color={color.accent1} disabled={this._isLoading}
            rightBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this._onCreate}>Создать</VButton.Fill>
        </VModalDialog.Actions>
      </VModalDialog>
    );
  }

  @action
  private _onCreate = async () => {
    try {
      this._isLoading = true;
      await this.props.onCreate(this.props.alert);
    } finally {
      runInAction(() => (this._isLoading = false));
    }
  };
}
