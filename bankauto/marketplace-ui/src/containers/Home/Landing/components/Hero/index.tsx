import React, { FC } from 'react';
import { ContainerWrapper, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { ButtonLink } from '../ButtonLink';
import { MenuItems } from 'constants/menuItems';
import { useStyles } from './Hero.styles';

export const Hero: FC = () => {
  const { imageWrapper, mainTitle, button, texts } = useStyles();
  const { isMobile } = useBreakpoints();
  const directory = isMobile ? 'mobile' : 'desktop';
  const {
    AllVehicles: { href: AllVehiclesHref },
  } = MenuItems;
  return (
    <div className={imageWrapper}>
      <ImageWebpGen
        src={`/images/${directory}/promoPageRedmondPromoBanner.webp`}
        title="Получи 5000 рублей на технику"
      />
      <ContainerWrapper className={mainTitle}>
        <div className={texts}>
          <Typography variant={isMobile ? 'h4' : 'h1'} component="h1">
            Получи 5000 рублей на технику
          </Typography>
          <Typography variant={isMobile ? 'h6' : 'h3'}>За регистрацию или покупку автомобиля</Typography>
        </div>
        {!isMobile ? (
          <ButtonLink text="Подобрать автомобиль" variant="contained" link={AllVehiclesHref} classname={button} />
        ) : null}
      </ContainerWrapper>
    </div>
  );
};
