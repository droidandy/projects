import React from 'react';
import { IVModalDialogProps, VButton, VModalDialog, VSpinner } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VThemeStoreTid } from '@invest.wl/view/src/Theme/V.Theme.types';
import { VThemeStore } from '@invest.wl/view/src/Theme/V.Theme.store';
import { VOrderItemModel } from '@invest.wl/view/src/Order/model/V.OrderItem.model';
import { observer } from 'mobx-react';
import { VOrderItem } from './V.OrderItem.component';
import { action, makeObservable, observable, runInAction } from 'mobx';

export interface IVOrderCancelModalProps extends IVModalDialogProps {
  order: VOrderItemModel;
  onCancel(model: VOrderItemModel): Promise<void>;
}

@observer
export class VOrderCancelModal extends React.Component<IVOrderCancelModalProps> {
  private _theme = IoC.get<VThemeStore>(VThemeStoreTid);

  constructor(props: IVOrderCancelModalProps) {
    super(props);
    makeObservable(this);
  }

  @observable private _isLoading = false;

  public render() {
    const { color, space, kit } = this._theme;
    const { order, onCancel, ...modalProps } = this.props;
    return (
      <VModalDialog {...modalProps}>
        <VModalDialog.Title pa={space.lg} pb={0}
          text={order.domain.isCancelled ? 'Заявка успешно снята' : 'Снять заявку?'} />
        {!order.domain.isCancelled && <VOrderItem model={order} noImage />}
        <VSpinner center animating={this._isLoading} />
        <VModalDialog.Actions>
          <VButton.Stroke flex radius={0} color={color.accent1} disabled={this._isLoading}
            leftBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={this.props.onClose}>Отмена</VButton.Stroke>
          <VButton.Fill flex radius={0} color={color.accent1} disabled={this._isLoading}
            rightBottomRadius={kit.ModalDialog.sRadius?.md}
            onPress={order.domain.isCancelled ? this.props.onClose : this._onCancel}
          >{order.domain.isCancelled ? 'Подтвердить' : 'Снять'}</VButton.Fill>
        </VModalDialog.Actions>
      </VModalDialog>
    );
  }

  @action
  private _onCancel = async () => {
    try {
      this._isLoading = true;
      await this.props.onCancel(this.props.order);
    } finally {
      runInAction(() => (this._isLoading = false));
    }
  };
}
