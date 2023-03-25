import React, { FC } from 'react';
import { ContainerWrapper, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { Link } from 'components';
import { MenuItems } from 'constants/menuItems';
import { useStyles } from './Hero.styles';

export const Hero: FC = () => {
  const { imageWrapper, mainTitle, link, linksContainer } = useStyles();
  const { isMobile } = useBreakpoints();
  const directory = isMobile ? 'mobile' : 'desktop';
  const {
    Home: { href: homeHref },
  } = MenuItems;
  return (
    <div className={imageWrapper}>
      <ImageWebpGen src={`/images/${directory}/heroImageIntegration.webp`} title="Вместе - к одной цели" />
      <ContainerWrapper className={mainTitle}>
        <div className="titleInner">
          <Typography variant={isMobile ? 'h2' : 'h1'} component="h1">
            Вместе - к одной цели
          </Typography>
          <div className={linksContainer}>
            <Link href={homeHref} className={link}>
              Главная
            </Link>
            <Typography component="span">Вместе - к одной цели</Typography>
          </div>
        </div>
      </ContainerWrapper>
    </div>
  );
};
