import React, { memo, FC, useMemo } from 'react';
import { Button, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { Link } from 'components';
import { useStyles } from './AdsCardExpocar.styles';

type Props = {
  isHorizontal?: boolean;
};

export const AdsCardExpocar: FC<Props> = memo(({ isHorizontal = false }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const imageSrc = useMemo(() => {
    const image = isMobile ? 'adsCardListBannerImageMobile.jpg' : 'adsCardListBannerImageDesktop.jpg';
    return `/images/expocar/${image}`;
  }, [isMobile]);
  return (
    <div className={s.root}>
      <div className={s.infoRoot}>
        <Typography variant={isHorizontal ? 'h3' : 'h4'} className={s.title}>
          Выездная диагностика автомобиля
        </Typography>
        <Typography component="div" variant={isHorizontal ? 'subtitle1' : 'subtitle2'} className={s.infoText}>
          Эксперт Банкавто за вас договорится с продавцом о встрече, проверит автомобиль, сделает фотографии,
          предоставит детальный отчёт
        </Typography>
        <div className={s.buttonItemContained}>
          <Link href="/inspections/">
            <Button variant="contained" color="primary" fullWidth className={s.mainButton}>
              <Typography variant="h5" component="span">
                Подробнее
              </Typography>
            </Button>
          </Link>
        </div>
      </div>
      <div className={`${s.image}${isHorizontal ? ' horizontal' : ''}`}>
        <ImageWebpGen src={imageSrc} />
      </div>
    </div>
  );
});
