import React, { FC, memo } from 'react';
import { Box, Typography } from '@material-ui/core';
import { COPYRIGHT } from '../constants';

type Props = {
  className?: string;
  isMobile?: boolean;
};

const CopyrightRoot: FC<Props> = ({ className, isMobile = false }): JSX.Element => {
  const copyrightBox = COPYRIGHT.map((item, index) => (
    <Typography key={index} variant="body2" style={isMobile ? { fontSize: '0.75rem' } : {}}>
      {item}
    </Typography>
  ));
  return <Box className={className}>{copyrightBox}</Box>;
};

export const Copyright = memo(CopyrightRoot);
