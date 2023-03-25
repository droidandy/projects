import React, { FC, ElementType } from 'react';
import cx from 'classnames';
import { Grid, Icon } from '@marketplace/ui-kit';
import { ReactComponent as IconDelete } from '@marketplace/ui-kit/icons/icon-delete-red';
import { StyledProps } from '@marketplace/ui-kit/types';

import Option, { OptionProps } from './Option';
import { useStyles } from './Option.styles';

interface Props extends OptionProps, StyledProps {
  icon?: ElementType;
}

const OptionSelected: FC<Props> = ({ children, icon = IconDelete, className, ...rest }) => {
  const s = useStyles();
  return (
    <Option {...rest} className={cx(s.optionSelected, className)}>
      <Grid container justify="space-between" alignItems="center" wrap="nowrap">
        <Grid item className={s.optionLabel}>
          {children}
        </Grid>
        <Grid item>
          <Icon component={icon} className={s.iconSelected} viewBox="0 0 20 20" />
        </Grid>
      </Grid>
    </Option>
  );
};

export default OptionSelected;
