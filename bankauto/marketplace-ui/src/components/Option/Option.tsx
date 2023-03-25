import React from 'react';
import cx from 'classnames';
import MenuItem, { MenuItemProps } from '@material-ui/core/MenuItem';
import { useStyles } from './Option.styles';

export type OptionProps = MenuItemProps;

const Option = ({ children, className, ...rest }: OptionProps) => {
  const s = useStyles();
  return (
    <MenuItem {...rest} button className={cx(s.option, className)}>
      {children}
    </MenuItem>
  );
};

export default Option;
