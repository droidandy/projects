import React, { FC } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { FinanceCards } from './components/FinanceCards';

const SafeDeal: FC = () => {
  const { isMobile } = useBreakpoints();

  return (
    <Box
      bgcolor={isMobile ? 'white' : 'grey.200'}
      borderRadius="0.5rem"
      pt={isMobile ? '0' : '2.5rem'}
      mb={isMobile ? '0' : '2.5rem'}
    >
      <Box mb={isMobile ? '0' : '4rem'}>
        <Typography variant={isMobile ? 'h4' : 'h2'} component="h2" align="center">
          Уникальное предложение - безопасная сделка в офисе банка!
        </Typography>
      </Box>
      <Box pb={isMobile ? '0' : '5rem'}>
        <FinanceCards />
      </Box>
    </Box>
  );
};

export { SafeDeal };
