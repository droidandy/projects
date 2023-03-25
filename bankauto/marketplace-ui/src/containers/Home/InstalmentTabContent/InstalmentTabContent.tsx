import { Box, useBreakpoints } from '@marketplace/ui-kit';
import React from 'react';
import { InstalmentFilter } from '../InstalmentFilter/InstalmentFilter';
import { useStyles } from './InstalmentTabContent.styles';
import { InstalmentInfoContainer } from './InstalmentInfoContainer/InstalmentInfoContainer';

export const InstalmentTabContent = () => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  return (
    <Box className={s.root}>
      <InstalmentFilter />
      {!isMobile && (
        <Box className={s.flowWrapper} pt={2}>
          <InstalmentInfoContainer />
        </Box>
      )}
    </Box>
  );
};
