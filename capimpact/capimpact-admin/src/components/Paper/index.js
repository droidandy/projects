import React from 'react';
import classNames from 'classnames';

import classes from './styles.module.scss';

const Paper = ({ children, className, ...props }) => (
  <div className={classNames(classes.paper, className)} {...props}>
    {children}
  </div>
);

export default Paper;
