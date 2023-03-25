import React, { ComponentType, SVGProps } from 'react';
import { Box, Icon, Typography } from '@marketplace/ui-kit';
import { useStyles } from './instalmentInfoItem.styles';

interface InstalmentInfoItemProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  text: string;
}
export const InstalmentInfoItem = ({ icon, text }: InstalmentInfoItemProps) => {
  const s = useStyles();
  return (
    <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" width="20.75rem">
      <Box pb={3.25}>
        <Icon component={icon} className={s.icon} viewBox="0 0 48 48" fontSize="large" />
      </Box>
      <Typography variant="h4" component="pre" className={s.text}>
        {text}
      </Typography>
    </Box>
  );
};
