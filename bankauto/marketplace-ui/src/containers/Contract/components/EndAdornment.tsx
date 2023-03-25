import React, { FC } from 'react';
import { InfoTooltip, Typography } from '@marketplace/ui-kit';
import { useStyles } from '../Contract.styles';

type Props = { text: string };

export const EndAdornment: FC<Props> = ({ text }) => {
  const { tooltipTextColor } = useStyles();
  return (
    <InfoTooltip
      title={
        <Typography variant="body2" className={tooltipTextColor}>
          {text}
        </Typography>
      }
    />
  );
};
