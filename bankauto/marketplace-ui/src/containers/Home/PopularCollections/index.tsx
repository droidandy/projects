import React, { FC, memo } from 'react';
import { Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { analyticsPopularSelectionClick } from 'helpers/analytics/events/analyticsPopularSelectionClick';
import { PopularCollectionsItem } from './components';
import { POPULAR_COLLECTIONS } from './constants';
import { useStyles } from './PopularCollections.styles';

export const PopularCollections: FC = memo(() => {
  const { wrapper, mainTitle } = useStyles();
  const { isMobile } = useBreakpoints();
  const pushCollectionAnalyticsEvent = () => {
    analyticsPopularSelectionClick();
  };
  const collections = POPULAR_COLLECTIONS.map((item) => (
    <Grid item xs={12} sm={3}>
      <PopularCollectionsItem {...item} onClick={pushCollectionAnalyticsEvent} />
    </Grid>
  ));

  return (
    <div>
      <Typography variant={isMobile ? 'h4' : 'h2'} align="center" className={mainTitle}>
        Популярные подборки
      </Typography>
      <Grid container className={wrapper} wrap={isMobile ? 'nowrap' : 'wrap'} spacing={2}>
        {collections}
      </Grid>
    </div>
  );
});
