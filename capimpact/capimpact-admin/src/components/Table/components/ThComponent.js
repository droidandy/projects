import React from 'react';
import classNames from 'classnames';

export default ({ toggleSort, className, children, ...rest }) => (
  <th
    className={classNames('rt-th', className)}
    onClick={e => toggleSort && toggleSort(e)}
    {...rest}
  >
    {children}
  </th>
);
