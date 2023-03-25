import React from 'react';
import { Box, Typography } from '@marketplace/ui-kit';
import { useStyles } from './SellFlowStep.styles';

type SellFlowStepProps = {
  icon: JSX.Element;
  title: string;
  dark: boolean;
};

export const SellFlowStep = ({ icon, title, dark }: SellFlowStepProps) => {
  const s = useStyles({ dark });

  return (
    <div>
      <Box mb="1.625rem" className={s.icon}>
        {icon}
      </Box>
      <Typography variant="h5" align="center" className={s.title}>
        {title}
      </Typography>
    </div>
  );
};
