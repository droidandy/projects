import React from 'react';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useStyles } from './CardInfoBlock.styles';

export const CardInfoBlock = () => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();
  return (
    <div className={s.root}>
      <div className={s.imageContainer}>
        <ImageWebpGen src="/images/cashbackPromo/cashbackPromoCardImage.png" alt="banner image" className={s.image} />
      </div>
      <div className={s.infoContent}>
        <Typography variant={isMobile ? 'h5' : 'h3'} component="div" className={s.title}>
          Получите 4 000 рублей реальными деньгами на карту «Дорожная»* <br />
          от РГС Банка за покупку автомобиля на маркетплейсе.
          <br /> Кешбэк можно использовать для оплаты любых товаров и услуг.
        </Typography>
        <Typography variant={isMobile ? 'body2' : 'body1'} component="div">
          * Кешбэк перечисляется на действующую дебетовую карту клиента банка.
          <br /> Если карты нет — ее можно легко оформить в любом отделении ПАО «РГС Банк».
        </Typography>
      </div>
    </div>
  );
};
