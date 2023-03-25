import React from 'react';
import classNames from 'classnames';

export default ({ children, className, ...rest }) => (
  <tr className={classNames('rt-tr', className)} {...rest}>
    {children}
  </tr>
);
