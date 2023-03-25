import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import Box, { Props as BoxProps } from '@marketplace/ui-kit/components/Box';
import { useStyles } from './InputsWrapper.styles';

interface Props extends BoxProps {
  title?: string;
  withShadow?: boolean;
}

export const InputsWrapper: FC<Props> = ({ children, title, withShadow = true, ...rest }) => {
  const s = useStyles();
  return (
    <div className={s.wrapper}>
      {title && (
        <Typography variant="h4" className={s.title}>
          {title}
        </Typography>
      )}
      <Box className={withShadow ? s.inputs : ''} {...rest}>
        {children}
      </Box>
    </div>
  );
};
