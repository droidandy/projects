import React from 'react';
import classNames from 'classnames';

const icons = {
  'ic-1': require('../../assets/icons/ic-1.png'),
  'ic-2': require('../../assets/icons/ic-2.png'),
  'ic-3': require('../../assets/icons/ic-3.png'),
};

export default ({ className, image, icon, ...props }) => {
  return image ? (
    <img src={icons[image]} alt={image} height="24" className={className} {...props} />
  ) : (
    <i className={classNames('fa', icon, className)} />
  );
};
