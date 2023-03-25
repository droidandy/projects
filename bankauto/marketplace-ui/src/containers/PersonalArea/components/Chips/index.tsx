import React, { FC, useMemo } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';

export type Chip = {
  bgcolor: string;
  text: string;
};

interface Props {
  items: Chip[];
}

export const Chips: FC<Props> = ({ items }) => {
  const { isMobile } = useBreakpoints();

  const chipsList = useMemo(
    () =>
      items?.map(({ bgcolor, text }, index) => (
        <Box
          key={index}
          display="flex"
          alignItems="center"
          bgcolor={bgcolor}
          borderRadius="0.25rem"
          py={0.375}
          px={1.25}
          mt={isMobile && !!index && 1.25}
          mr={index + 1 !== items.length && 1.25}
        >
          <Typography variant="overline" style={{ color: '#fff', letterSpacing: '0.0625rem', lineHeight: '0.875rem' }}>
            {text}
          </Typography>
        </Box>
      )),
    [items, isMobile],
  );

  return (
    <Box display="flex" alignItems={!isMobile ? 'center' : 'flex-start'} flexDirection={!isMobile ? 'row' : 'column'}>
      {chipsList}
    </Box>
  );
};
