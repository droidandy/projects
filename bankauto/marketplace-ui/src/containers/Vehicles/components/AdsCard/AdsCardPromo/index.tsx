import React, { memo, FC } from 'react';
import { Typography, Button, useBreakpoints } from '@marketplace/ui-kit';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { Link } from 'components/Link';
import { useStyles } from './AdsCardPromo.styles';

export interface AdsCardPromoProps {
  title: string;
  subtitle: string;
  imageSrc: string;
  link: string;
  typographyTheme: 'light' | 'dark';
}

export const AdsCardPromo: FC<AdsCardPromoProps> = memo(({ title, subtitle, imageSrc, link, typographyTheme }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const color = typographyTheme === 'light' ? '#fff' : '#222';
  return (
    <div className={s.root}>
      <div className={s.contentWrapper}>
        <div className={s.titleWrapper}>
          <Typography variant={isMobile ? 'h4' : 'h2'} component="p" className={s.title} style={{ color }}>
            {title}
          </Typography>
          <Typography variant={isMobile ? 'h6' : 'h5'} component="div" style={{ color }}>
            {subtitle}
          </Typography>
        </div>
        <div className={s.imageWrapper}>
          <ImageWebpGen src={imageSrc} alt={title} />
        </div>
        <div className={s.buttonWrapper}>
          <Link href={link}>
            <Button variant="contained" color="primary" size="large" fullWidth>
              <Typography variant="h5" component="span">
                Подробнее
              </Typography>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
});
