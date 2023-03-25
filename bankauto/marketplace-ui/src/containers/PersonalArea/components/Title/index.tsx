import React, { FC } from 'react';
import { Box, Divider, Typography } from '@material-ui/core';
import { BoxProps } from '@material-ui/core/Box';
import useBreakpoints from '@marketplace/ui-kit/hooks/useBreakpoints';

interface Props extends BoxProps {
  text: string;
  showDivider?: boolean;
}

export const Title: FC<Props> = ({ text, showDivider, children, ...boxProps }) => {
  const { isMobile } = useBreakpoints();

  return (
    <>
      <Box display="flex" alignItems="center" flexWrap="wrap" pb={2.5} {...boxProps}>
        <Typography variant={isMobile ? 'h4' : 'h3'}>{text}</Typography>
        {children}
      </Box>
      {showDivider && <Divider />}
    </>
  );
};
