import React, { FC } from 'react';
import { Box, Typography } from '@material-ui/core';
import { Link } from 'components/Link';
import { useStyles } from './LinkButton.styles';
import { ProfileCard } from 'containers/PersonalArea/Root/types';

type Props = {
  card: ProfileCard;
};

export const LinkButton: FC<Props> = ({ card }) => {
  const { button } = useStyles();

  return (
    <Link href={card.link} color="textPrimary">
      <Box display="flex" alignItems="center" p={2.5} className={button}>
        <Box pr={2.5} display="flex" alignItems="center">
          {card.icon}
        </Box>
        <Typography variant="h5" component="span">
          {card.title}
        </Typography>
      </Box>
    </Link>
  );
};
