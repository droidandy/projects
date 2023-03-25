import React, { FC } from 'react';
import { Box, Img } from '@marketplace/ui-kit';
import { SpecialOfferItem } from '@marketplace/ui-kit/types';
import { Typography } from '@material-ui/core';
import { useStyles } from './SpecialProgramsSlide.styles';

type Props = {
  item: SpecialOfferItem;
};

export const SpecialProgramsSlide: FC<Props> = ({ item }) => {
  const classes = useStyles();
  return (
    <Box className={classes.slide} position="relative">
      {!!item.images && <Img src={item.images['1580']} className={classes.mainImg} />}
      <Typography className={classes.title} component="h5" variant="subtitle1">
        {item.name}
      </Typography>
    </Box>
  );
};
