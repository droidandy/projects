import React, { memo, useEffect, FC } from 'react';
import cx from 'classnames';
import { Typography } from '@material-ui/core';
import { Box, Img, useBreakpoints } from '@marketplace/ui-kit';
import { Partner } from '@marketplace/ui-kit/types';
import { usePartners } from 'store/partners';
import { useStyles } from './PartnersSection.styles';

const DURATION_COEFFICIENT = 5;

interface Props {
  className?: string;
}

const PartnersSectionRoot: FC<Props> = ({ className }: Props) => {
  const { partners, fetchPartners, initial: initialState } = usePartners();
  const { isMobile } = useBreakpoints();
  const s = useStyles({ animationDuration: (partners?.length || 0) * DURATION_COEFFICIENT * 1000 })();
  useEffect(() => {
    if (!initialState) {
      fetchPartners();
    }
  }, [fetchPartners, initialState]);

  if (!partners) return <></>;

  const list = partners?.map(({ name, logo, id }: Partner) => (
    <li className={s.imagesBlockItem} key={id}>
      <Img src={logo} alt={name} contain />
    </li>
  ));

  return (
    <div className={cx(s.partnersBlock, className)}>
      <Box pb={5}>
        <Typography component="h2" variant={isMobile ? 'h4' : 'h2'}>
          Наши партнеры
        </Typography>
      </Box>
      <div className={s.sliders}>
        <ul className={cx(s.imagesBlock, s.imagesBlockFirst)}>{list}</ul>
        <ul className={cx(s.imagesBlock, s.imagesBlockSecond)}>{list}</ul>
      </div>
    </div>
  );
};

const PartnersSection = memo(PartnersSectionRoot);

export { PartnersSection };
