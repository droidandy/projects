import React, { FC } from 'react';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Link } from 'components';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { useStyles } from '../../PopularCollections.styles';

export type PopularCollectionsItemProps = {
  src: string;
  href: string;
  title: string;
  subTitle?: string;
  onClick: () => void;
};

export const PopularCollectionsItem: FC<PopularCollectionsItemProps> = ({ src, href, title, subTitle }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  return (
    <Link href={href}>
      <div className={s.root}>
        <ImageWebpGen src={src} title={`${title} ${subTitle || ''}`} />
        <Typography variant={isMobile ? 'h4' : 'h3'} color="primary" component="p" className={s.title}>
          {title}
          <br />
          {subTitle}
        </Typography>
      </div>
    </Link>
  );
};
