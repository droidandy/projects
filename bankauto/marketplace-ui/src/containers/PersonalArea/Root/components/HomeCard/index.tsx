import React, { FC } from 'react';
import { Box, Typography } from '@marketplace/ui-kit';
import { Link } from 'components';
import { useStyles } from './HomeCard.styles';
import { ProfileCard } from 'containers/PersonalArea/Root/types';

interface HomeCardProps {
  card: ProfileCard;
}

export const HomeCard: FC<HomeCardProps> = ({ card, children }) => {
  const s = useStyles();

  const textBlock = (
    <>
      <Box display="flex" alignItems="center">
        <Box mr={2.5} display="flex">
          {card.icon}
        </Box>
        <Box>
          <Typography component="span" variant="h3" color="textPrimary">
            {card.title}
          </Typography>
          {card.subtitle && (
            <Box>
              <Typography component="span" variant="subtitle1" color="textSecondary">
                {card.subtitle}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );

  return (
    <Link href={card.link}>
      <Box className={s.root} style={{ height: '100%' }}>
        <Box p={3.75} display="flex" flexDirection="column">
          {textBlock}
          {children && <Box>{children}</Box>}
        </Box>
      </Box>
    </Link>
  );
};
