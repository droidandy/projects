import React from 'react';
import { Icon } from 'components';
import { notification as antNotification } from 'antd';
import css from './styles.css';

function notification(data) {
  const { content, icon, className, ...rest } = data;
  return antNotification.open({
    className: `${css.infoNotification} ${css[className]}`,
    description: content,
    duration: 5,
    icon: <Icon icon={ icon } />,
    ...rest
  });
}

export default {
  success(content, params) {
    return notification({ content, icon: 'Checkmark', className: 'success', ...params });
  },
  error(content, params) {
    return notification({ content, icon: 'Cross', className: 'error', ...params });
  },
  info(content, params) {
    return notification({ content, icon: 'Info', className: 'info', ...params });
  },
  warning(content, params) {
    return notification({ content, icon: 'Warning', className: 'warning', ...params });
  }
};
