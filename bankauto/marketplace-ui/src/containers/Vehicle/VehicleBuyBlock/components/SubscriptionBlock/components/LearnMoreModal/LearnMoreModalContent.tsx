import React from 'react';
import { Box, Icon, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconOk } from 'icons/iconOk.svg';
import { useStyles } from './LearnMoreModal.styles';

export const LearnMoreModalContent = () => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  return (
    <>
      <Box pb={4} pt={isMobile ? 1.5 : 0} display="flex" alignItems="center" justifyContent="center">
        <Icon component={IconOk} className={s.icon} viewBox="0 0 56 56" />
      </Box>
      <Typography variant="subtitle1" component="h5" align="center">
        Владеть автомобилем с комфортом
      </Typography>
      <Typography variant="body2" component="h5" align="center" className={s.text}>
        Все необходимое вам включено в единый ежемесячный платеж: страховка, ТО, налоги, сезонная замена шин!
      </Typography>
      <Typography variant="subtitle1" component="h5" align="center">
        Нет необходимости покупать авто
      </Typography>
      <Typography variant="body2" component="h5" align="center" className={s.text}>
        Начните без первоначального взноса. Выдача авто за несколько дней.
      </Typography>
      <Typography variant="subtitle1" component="h5" align="center">
        Выгодно платить
      </Typography>
      <Typography variant="body2" component="h5" align="center" className={s.text}>
        Никаких переплат — только выгодный ежемесячный платёж.
      </Typography>
    </>
  );
};
