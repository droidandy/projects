import React, { FC } from 'react';
import { Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useStyles } from './InfoItem.styles';

type InfoItemClasses = ReturnType<typeof useStyles>;

export interface InfoItemProps {
  icon: React.ReactNode;
  title: string;
  text: string;
  classes?: Partial<InfoItemClasses>;
}

export const InfoItem: FC<InfoItemProps> = ({ icon, title, text, classes: classesProp }) => {
  const { isMobile } = useBreakpoints();
  const classes = useStyles({ classes: classesProp });
  return (
    <Grid item xs={12} sm={4}>
      <div className={classes.root}>
        {icon}
        <Typography component="p" className={classes.title} variant={isMobile ? 'h4' : 'h3'}>
          {title}
        </Typography>
        <Typography component="p" className={classes.text} variant={isMobile ? 'body1' : 'h4'}>
          {text}
        </Typography>
      </div>
    </Grid>
  );
};
