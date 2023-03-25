import React, { FC } from 'react';
import { Typography, useBreakpoints, Button } from '@marketplace/ui-kit';
import { Link } from 'components';
import { Section } from '../../constants';
import { useStyles } from './HeroTitle.styles';

type Props = Pick<Section, 'title' | 'subtitle'> & {
  styles?: React.CSSProperties;
  btnText: string;
  href: string;
};

export const HeroTitle: FC<Props> = ({ title, subtitle, styles }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  return (
    <div className={s.root}>
      <Typography variant={isMobile ? 'h4' : 'h1'} component="h1" className={s.title} style={styles}>
        {title}
      </Typography>
      <Typography variant={isMobile ? 'h6' : 'h3'} component="h3">
        {subtitle}
      </Typography>
    </div>
  );
};

export const HeroTitleWithButton: FC<Props> = ({ title, subtitle, styles, btnText, href }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  return (
    <div className={s.stockRoot}>
      <Typography variant={isMobile ? 'h4' : 'h1'} component="div" className={s.title} style={styles}>
        {title}
      </Typography>
      <Typography variant={isMobile ? 'h6' : 'h3'} component="h3">
        {subtitle}
      </Typography>
      <div className={s.buttonWrapper}>
        <Link href={href} className={s.link}>
          <Button
            variant={isMobile ? 'outlined' : 'contained'}
            color="primary"
            size="large"
            className={s.button}
            fullWidth
          >
            <Typography variant="h5" component="span">
              {btnText}
            </Typography>
          </Button>
        </Link>
      </div>
    </div>
  );
};
