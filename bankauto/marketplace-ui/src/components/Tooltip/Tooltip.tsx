import React, { FC } from 'react';
import { Tooltip as MaterialTooltip } from '@material-ui/core';
import { TooltipProps } from '@material-ui/core/Tooltip/Tooltip';

import { useStyles } from './Tooltip.styles';
import cx from 'classnames';

export interface Props extends TooltipProps {
  isMobilePortalTooltip?: boolean;
}

const Tooltip: FC<Props> = ({ children, isMobilePortalTooltip, ...restProps }: Props) => {
  const styles = useStyles();

  return (
    <MaterialTooltip
      classes={{ tooltip: cx(styles.tooltip, isMobilePortalTooltip && styles.smallTooltip) }}
      {...restProps}
    >
      {children}
    </MaterialTooltip>
  );
};

export { Tooltip };
