import React, { FC } from 'react';
import { useStyles } from './SoldOutInfo.styles';
import { ReactComponent as CheckIcon } from 'icons/iconCheckSquare.svg';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
export const SoldOutInfo: FC = () => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  return (
    <div className={s.root}>
      <div className={s.icon}>
        <CheckIcon height={isMobile ? '3rem' : '4rem'} width={isMobile ? '3rem' : '4rem'} />
      </div>
      <Typography variant={isMobile ? 'h5' : 'h4'} component="span">
        Этот автомобиль уже продан
      </Typography>
    </div>
  );
};
