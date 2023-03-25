import React, { FC } from 'react';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useStyles } from './AdsCardExpocarContainer.styles';

export const InspectionDescription: FC = () => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();
  return (
    <>
      <Typography variant={isMobile ? 'h4' : 'h3'}>Выездная диагностика автомобиля</Typography>
      <Typography component="div" variant={isMobile ? 'subtitle2' : 'subtitle1'} className={s.description}>
        Историю этого автомобиля, документы и его техническое состояние может проверить за вас эксперт Банкавто. Он сам
        встретится с продавцом и подготовит подробный отчет с фотографиями.
      </Typography>
    </>
  );
};
