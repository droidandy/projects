import { IVFlexProps, VCol, VIcon, VRow, VText, VTouchable } from '@invest.wl/mobile';
import { VNotificationModel } from '@invest.wl/view/src/Notification/model/V.Notification.model';
import { observer } from 'mobx-react';
import React from 'react';

export interface IVNotificationItemProps extends IVFlexProps {
  model: VNotificationModel;
}

@observer
export class VNotificationItem extends React.Component<IVNotificationItemProps> {
  public render() {
    const { model, ...flexProps } = this.props;
    const { title, message, bgColor, textColor, closeable, close } = model;

    return (
      <VTouchable.Opacity mh={16} mv={8} radius={10}
        pa={16} justifyContent={'space-between'} alignItems={'center'}
        activeOpacity={1} onPress={close} bg={bgColor}>
        <VRow alignItems={'center'} {...flexProps}>
          <VCol flex={15}>
            {!!title && <VText font={'body13'} color={textColor}>{title}</VText>}
            <VText font={'body13'} color={textColor}>{message}</VText>
          </VCol>
          {closeable && <VIcon flex={1} color={textColor} fontSize={20} name={'close'} />}
        </VRow>
      </VTouchable.Opacity>
    );
  }
}
