import React from 'react';
import classNames from 'classnames';

export default ({ toggleSort, className, children, ...rest }) => (
  <td className={classNames('rt-td', className)} {...rest}>
    {children}
  </td>
);
