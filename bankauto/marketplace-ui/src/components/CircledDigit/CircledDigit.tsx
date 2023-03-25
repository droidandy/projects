import React, { FC } from 'react';
import { Box } from '@marketplace/ui-kit';
import cx from 'classnames';

import { Color } from 'constants/Color';

import { useStyles } from './CircledDigit.styles';

interface Props {
  circleColor: Color;
  large?: boolean;
}

export const CircledDigit: FC<Props> = ({ circleColor, children, large = false }) => {
  const s = useStyles({ circleColor });

  return (
    <Box className={cx(s.circle, { [s.large]: large })} display="flex" justifyContent="center" alignItems="center">
      {children}
    </Box>
  );
};
