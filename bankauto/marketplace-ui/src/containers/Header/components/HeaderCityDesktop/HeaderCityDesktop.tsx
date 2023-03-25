import React, { FC } from 'react';
import { Button, Icon, Typography } from '@material-ui/core';
import { HeaderCityProps } from 'containers/Header/types';
import { useStyles } from './HeaderCityDesktop.styles';

export const HeaderCityDesktop: FC<HeaderCityProps> = ({ cityName, onClick, icon, textStyle, coverageRadius }) => {
  const s = useStyles();
  return (
    <div className={s.root}>
      <Button
        startIcon={<Icon viewBox="0 0 24 24" fontSize="large" component={icon} className={s.icon} />}
        onClick={onClick}
      >
        <div className={s.texts}>
          <div className={textStyle}>{cityName}</div>
          {coverageRadius ? <Typography className={s.coverage}> + {coverageRadius} км</Typography> : null}
        </div>
      </Button>
    </div>
  );
};
