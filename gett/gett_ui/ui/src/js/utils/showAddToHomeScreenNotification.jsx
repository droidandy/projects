import React from 'react';
import { notification } from 'antd';
import { Icon } from 'components';
import { isSafariMobile } from 'utils/userAgent';

const sessionKeyClosed = 'addToHomeScreenNotificationClosed';

export default function showAddToHomeScreenNotification() {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  if (!sessionStorage.getItem(sessionKeyClosed) && !isStandalone) {
    notification.success({
      message: 'Add to Home Screen',
      description: (
        <div>
          Install this app on your phone: tap
          { isSafariMobile
            ? <Icon icon="ExportIcon" className="text-20 mr-5 ml-5" />
            : ' menu icon '
          }
          and then Add to Home Screen
          { isSafariMobile && <div className="notification-arrow" /> }
        </div>
      ),
      icon: <Icon icon="IconGett" />,
      duration: 0,
      placement: isSafariMobile ? 'bottomRight' : 'topRight',
      className: 'overflow-visible',
      onClose: sessionStorage.setItem(sessionKeyClosed, true)
    });
  }
}
