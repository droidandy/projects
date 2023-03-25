import React, { FC } from 'react';
import { Box, Icon, Typography } from '@marketplace/ui-kit';
import { ReactComponent as RightArrowIcon } from '@marketplace/ui-kit/icons/carousel-arrow-right';
import { useStyles } from './OptionsDrawer.styles';

interface Props {
  onClick: () => void;
}

export const OptionsDrawerButton: FC<Props> = ({ onClick }) => {
  const s = useStyles();

  return (
    <Box className={s.wrapper} onClick={onClick}>
      <Typography component="p" variant="h5">
        Опции
        <Typography component="span" variant="caption" color="textSecondary" style={{ paddingLeft: '.625rem' }}>
          Необязательно
        </Typography>
      </Typography>

      <Icon viewBox="0 0 16 16" component={RightArrowIcon} className={s.icon} />
    </Box>
  );
};
