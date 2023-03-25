import React from 'react';
import classNames from 'classnames';

export default ({ children, className, ...rest }) => (
  <thead className={classNames('rt-thead', className)} {...rest}>
    {children}
  </thead>
);
