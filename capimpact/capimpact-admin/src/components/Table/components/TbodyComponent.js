import React from 'react';
import classNames from 'classnames';

export default ({ children, className, ...rest }) => (
  <tbody className={classNames('rt-tbody', className)} {...rest}>
    {children}
  </tbody>
);
