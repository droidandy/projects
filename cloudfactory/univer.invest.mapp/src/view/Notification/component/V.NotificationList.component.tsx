import { observer } from 'mobx-react';
import React from 'react';
import { IVFlexProps, VCol } from '@invest.wl/mobile/src/view/kit';
import { IoC } from '@invest.wl/core/src/di/IoC';
import { VNotificationItem } from './V.NotificationItem.component';
import { LayoutAnimation } from 'react-native';
import { VNotificationModel } from '@invest.wl/view/src/Notification/model/V.Notification.model';
import {
  VNotificationListPresent, VNotificationListPresentTid,
} from '@invest.wl/view/src/Notification/present/V.NotificationList.present';

interface IVNotificationListProps extends IVFlexProps {
}

@observer
export class VNotificationList extends React.Component<IVNotificationListProps> {
  public static AnimationDuration = 200;

  private _pr = IoC.get<VNotificationListPresent>(VNotificationListPresentTid);

  public componentDidUpdate() {
    LayoutAnimation.configureNext({
      duration: VNotificationList.AnimationDuration,
      create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.scaleXY,
      },
      update: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
      delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity,
      },
    });
  }

  public render() {
    const { ...flexProps } = this.props;

    return (
      <VCol absoluteFill pointerEvents={'box-none'} {...flexProps}>
        {this._pr.listX.list.map(this._renderNotificationItem)}
      </VCol>
    );
  }

  private _renderNotificationItem = (model: VNotificationModel, index: number) => (
    <VNotificationItem key={model.id} model={model} index={index} />
  );
}
