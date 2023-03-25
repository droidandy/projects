import React, { FC } from 'react';
import { Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { InfoItemProps, InfoItem } from './InfoItem';

interface Props {
  items: InfoItemProps[];
  title: string;
  titleWrapperClass: string;
  className?: string;
}

export const InfoItemsList: FC<Props> = ({ items, title, titleWrapperClass, className }) => {
  const { isMobile } = useBreakpoints();
  return (
    <div className={className}>
      <Grid container spacing={isMobile ? 3 : 5}>
        <Grid item xs={12} className={titleWrapperClass}>
          <Typography component="p" variant={isMobile ? 'h3' : 'h2'}>
            {title}
          </Typography>
        </Grid>
        {items.map((item) => (
          <InfoItem key={item.title} {...item} />
        ))}
      </Grid>
    </div>
  );
};
