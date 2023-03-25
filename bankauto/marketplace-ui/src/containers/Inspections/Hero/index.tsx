import React, { FC, useMemo } from 'react';
import { ContainerWrapper, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ImageWebpGen } from 'components/ImageWebpGen';

import { InfoWrapper } from './components/InfoWrapper';
import { useStyles } from './Hero.styles';

const title = 'Выездная диагностика автомобиля';
const infoText =
  'Эксперт Банкавто договорится с продавцом о встрече, проверит документы на машину и ее историю, \nсделает подробный отчет о техническом состоянии с фотографиями. Это поможет вам принять \nрешение о покупке и сэкономит много времени.';

export const Hero: FC = () => {
  const { imageWrapper, mainTitle, titleInner } = useStyles();
  const { isMobile } = useBreakpoints();
  const getImage = useMemo(() => {
    return isMobile ? '/images/mobile/heroImageSellInspections.jpg' : '/images/desktop/heroImageSellInspections.jpg';
  }, [isMobile]);

  return (
    <>
      <div className={imageWrapper}>
        <ImageWebpGen src={getImage} title={title} />
        <ContainerWrapper className={mainTitle}>
          <Typography className={titleInner}>{title}</Typography>
          {!isMobile && <InfoWrapper text={infoText} />}
        </ContainerWrapper>
      </div>
      {isMobile && (
        <ContainerWrapper mt={-5} zIndex={1} position="relative">
          <InfoWrapper text={infoText} />
        </ContainerWrapper>
      )}
    </>
  );
};
