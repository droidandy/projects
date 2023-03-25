import React, { ComponentType, SVGProps } from 'react';
import { Box, Icon, Typography } from '@marketplace/ui-kit';

type InstalmentInfoMobileItemProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
};

export const InstalmentInfoMobileItem = ({ icon, title }: InstalmentInfoMobileItemProps) => {
  return (
    <Box>
      <Box my={3.75} textAlign="center">
        <Icon
          component={icon}
          viewBox="0 0 48 48"
          style={{
            fill: 'none',
            height: '3rem',
            width: '3rem',
          }}
        />
      </Box>
      <Typography variant="h5" component="pre" align="center">
        {title}
      </Typography>
    </Box>
  );
};
