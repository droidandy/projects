import React, { FC } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { GuideInfoFlow } from 'components/StaticCustomerFlow';
import { CustomerFlowName } from 'constants/customerFlowOptions';

interface Props {
  title?: string;
  flowName: CustomerFlowName;
}

const GuideInfo: FC<Props> = ({ title, flowName }) => {
  const { isMobile } = useBreakpoints();
  return (
    <Box>
      {!!title && (
        <Box mb={isMobile ? '0' : '1.25rem'}>
          <Typography variant={isMobile ? 'h4' : 'h2'} component="h2" align="center">
            {title}
          </Typography>
        </Box>
      )}
      <GuideInfoFlow flowName={flowName} />
    </Box>
  );
};
export { GuideInfo };
