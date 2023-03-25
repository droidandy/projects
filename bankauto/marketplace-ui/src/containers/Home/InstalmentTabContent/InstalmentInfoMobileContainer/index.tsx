import React from 'react';
import { Box, ContainerWrapper, Typography } from '@marketplace/ui-kit';
import { Swiper } from 'components/Swiper';
import { ReactComponent as iconOnline } from 'icons/iconOnlineColor.svg';
import { ReactComponent as iconCalendar } from 'icons/iconCalendarPayColor.svg';
import { ReactComponent as iconCreditCard } from 'icons/iconCreditCardColor.svg';
import { useStyles } from './InstalmentInfoMobileContainer.styles';
import { InstalmentInfoMobileItem } from '../components/InstalmentInfoMobileItem/InstalmentInfoMobileItem';

const infoData = [
  { text: 'Без первоначального\n взноса', icon: iconCreditCard },
  { text: 'Одобрение\n онлайн', icon: iconOnline },
  { text: 'Фиксированный\n платеж', icon: iconCalendar },
];
export const InstalmentInfoMobileContainer = () => {
  const s = useStyles();
  return (
    <ContainerWrapper className={s.root}>
      <Box textAlign="center" py={2.5}>
        <Typography component="h4" variant="h4">
          Автомобиль в рассрочку
        </Typography>
      </Box>
      <Swiper loop={false} slidesPerView={1.1} centeredSlides spaceBetween={10}>
        {infoData.map((item) => (
          <Box position="relative" className={s.slide}>
            <InstalmentInfoMobileItem title={item.text} icon={item.icon} />
          </Box>
        ))}
      </Swiper>
    </ContainerWrapper>
  );
};
