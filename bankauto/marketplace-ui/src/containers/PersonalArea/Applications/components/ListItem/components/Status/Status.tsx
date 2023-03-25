import React, { FC } from 'react';
import { Box, Typography } from '@marketplace/ui-kit';
import { ReactComponent as IconSuccess } from 'icons/iconSuccess.svg';
import { ReactComponent as IconProhibit } from 'icons/iconProhibitRed.svg';

interface Props {
  text: string;
  icon?: 'success' | 'prohibit';
}

const ICON_MAP = {
  success: <IconSuccess />,
  prohibit: <IconProhibit />,
};

export const Status: FC<Props> = ({ text, icon = 'success' }) => (
  <Box display="flex" alignItems="center">
    {ICON_MAP[icon]}
    <Box pl={1.25}>
      <Typography variant="subtitle1" component="span">
        {text}
      </Typography>
    </Box>
  </Box>
);
