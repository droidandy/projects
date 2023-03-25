import React, { FC } from 'react';

import { Icon, Typography, Paper } from '@marketplace/ui-kit';

import cx from 'classnames';
import { useStyles } from './StaticCustomerFlowMobileItem.styles';

interface Props {
  item: {
    id: number;
    title: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    showArrow: boolean;
    subtitle?: string;
  };
  grayInMobile?: boolean;
}

const StaticCustomerFlowMobileItem: FC<Props> = ({ item, grayInMobile }) => {
  const classes = useStyles();

  return (
    <Paper elevation={grayInMobile ? 0 : 1}>
      <div className={cx(classes.root, { [classes.gray]: grayInMobile })}>
        <div className={classes.iconContainer}>
          <Icon className={classes.icon} viewBox="0 0 48 48" component={item.icon} />
        </div>

        <Typography className={classes.title} variant="h5" component="span">
          {item.title}
        </Typography>
        {item.subtitle ? (
          <Typography align="center" variant="body1">
            {item.subtitle}
          </Typography>
        ) : (
          <></>
        )}
      </div>
    </Paper>
  );
};

export { StaticCustomerFlowMobileItem };
