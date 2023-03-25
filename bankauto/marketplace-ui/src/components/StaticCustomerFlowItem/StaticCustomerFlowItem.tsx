import React, { FC } from 'react';

import cx from 'classnames';
import { Box, Icon, Typography, Grid } from '@marketplace/ui-kit';

import { useStyles } from './StaticCustomerFlowItem.styles';

interface Props {
  isLastItem: boolean;
  isShortOptionsList?: boolean;
  item: {
    id: number;
    title: string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    showArrow: boolean;
    subtitle?: string;
  };
}

const StaticCustomerFlowItem: FC<Props> = ({ item, isLastItem, isShortOptionsList }) => {
  const classes = useStyles();
  return (
    <Grid
      container
      className={cx(
        classes.flowItemContainer,
        item.showArrow && classes.arrow,
        isLastItem && classes.last,
        isShortOptionsList && classes.shortList,
      )}
      spacing={2}
      direction="column"
      alignItems="center"
      justify="flex-start"
    >
      <Grid container item justify="center" className={classes.iconContainer}>
        <Icon className={classes.icon} viewBox="0 0 48 48" component={item.icon} />
      </Grid>
      <Grid container item justify="center">
        <Box whiteSpace="pre-line">
          <Typography align="center" className={cx(classes.title)} variant="h5">
            {item.title}
          </Typography>
          {item.subtitle && (
            <Typography align="center" variant="body1">
              {item.subtitle}
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export { StaticCustomerFlowItem };
