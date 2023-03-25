import React, { FC } from 'react';
import { Button, Divider, Icon, Typography } from '@material-ui/core';
import { HeaderCityProps } from 'containers/Header/types';
import { useStyles } from './HeaderCityMobile.styles';

export const HeaderCityMobile: FC<HeaderCityProps> = ({ cityName, icon, textStyle, onClick, coverageRadius }) => {
  const s = useStyles();
  return (
    <>
      <div className={s.root}>
        <Button
          startIcon={<Icon viewBox="0 0 24 24" fontSize="large" component={icon} className={s.icon} />}
          onClick={onClick}
        >
          <div className={s.texts}>
            <Typography variant="subtitle1" component="div" className={textStyle}>
              {cityName}
            </Typography>
            {coverageRadius ? <Typography className={s.coverage}> + {coverageRadius} км</Typography> : null}
          </div>
        </Button>
      </div>
      <Divider />
    </>
  );
};
