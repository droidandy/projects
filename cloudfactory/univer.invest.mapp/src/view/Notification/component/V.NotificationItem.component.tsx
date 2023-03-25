import moment from 'moment';
import React from 'react';
import { VCol, VIcon, VRow, VText, VTouchable } from '@invest.wl/mobile/src/view/kit';
import { observer } from 'mobx-react';
import { VNotificationModel } from '@invest.wl/view/src/Notification/model/V.Notification.model';

export interface IVNotificationItemProps {
  model: VNotificationModel;
  index?: number;
}

@observer
export class VNotificationItem extends React.Component<IVNotificationItemProps> {
  private _timeout: any;

  public componentDidMount() {
    this._updateTimeout();
  }

  public componentDidUpdate(prevProps: IVNotificationItemProps) {
    this._updateTimeout();
  }

  public componentWillUnmount() {
    clearTimeout(this._timeout);
  }

  private _updateTimeout() {
    clearTimeout(this._timeout);
    const timeout = -moment().diff(this.props.model.closeTime);
    this._timeout = setTimeout(() => this.props.model.domain.remove(), timeout);
  }

  public render() {
    const { title, message, bgColor, textColor, domain: { remove } } = this.props.model;

    return (
      <VTouchable.Opacity mh={16} mv={8} radius={10}
        pa={16} justifyContent={'space-between'} alignItems={'center'}
        activeOpacity={1} onPress={remove} bg={bgColor}>
        <VRow alignItems={'center'}>
          <VCol flex={15}>
            {!!title && <VText font={'body13'} color={textColor}>{title}</VText>}
            <VText font={'body13'} color={textColor}>{message}</VText>
          </VCol>
          <VIcon flex={1} color={textColor} fontSize={20} name={'close'} />
        </VRow>
      </VTouchable.Opacity>
    );
  }
}
