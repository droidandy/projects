import React from 'react';
import classNames from 'classnames';

export default ({ children, className, height = 600, ...rest }) => (
  <div style={{ position: 'relative', overflow: 'auto', width: '100%', height }}>
    <table className={classNames('rt-table', className)} {...rest}>
      {children}
    </table>
  </div>
);

// table table-borderless
