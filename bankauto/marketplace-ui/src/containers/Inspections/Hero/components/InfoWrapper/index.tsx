import React, { FC } from 'react';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';
import cx from 'classnames';
import { useStyles } from './InfoWrapper.styles';

interface InfoWrapperProps {
  text: string;
  className?: string;
}

export const InfoWrapper: FC<InfoWrapperProps> = ({ text, className }) => {
  const { root } = useStyles();
  const { isMobile } = useBreakpoints();
  return isMobile ? (
    <Typography variant="h5" component="div" color="textPrimary" className={cx(root, className)}>
      {text}
    </Typography>
  ) : (
    <Typography variant="h3" component="pre">
      {text}
    </Typography>
  );
};
