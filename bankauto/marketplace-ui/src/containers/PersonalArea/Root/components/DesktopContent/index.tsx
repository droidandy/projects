import React, { FC, useMemo } from 'react';
import { Box, Grid, Typography } from '@material-ui/core';
import { HomeCard } from '../HomeCard';
import { useSelector } from 'react-redux';
import { StateModel } from 'store/types';
import { getCardsData } from '../../helpers/getCardsData';
import { CARDS } from '../../constants';
import { formatPhone } from 'helpers';

export const DesktopContent: FC = () => {
  const { userFullName, phone, email } = useSelector((state: StateModel) => ({
    userFullName: `${state.user.lastName} ${state.user.firstName}`,
    phone: state.user.phone,
    email: state.user.email,
  }));

  const cards = useMemo(() => getCardsData(userFullName), [userFullName]);

  const additionalCardsInfo = useMemo(
    (): Record<string, any> => ({
      [CARDS.PERSONAL_INFO]: (
        <Box mt={1.25} pl={1}>
          <Box display="flex">
            <Typography component="span" variant="subtitle1" color="textSecondary">
              Телефон
            </Typography>
            <Box ml={1.25}>
              <Typography component="span" variant="subtitle1" color="textPrimary">
                {formatPhone(phone)}
              </Typography>
            </Box>
          </Box>
          {email && (
            <Box display="flex" mt={1.25}>
              <Typography component="span" variant="subtitle1" color="textSecondary">
                Email
              </Typography>
              <Box ml={1.25}>
                <Typography component="span" variant="subtitle1" color="textPrimary">
                  {email}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      ),
    }),
    [],
  );

  return (
    <Box pt={6.2}>
      <Grid container spacing={4}>
        {cards.mainCards.map((card) => (
          <Grid xs={12} sm item key={card.id}>
            <HomeCard card={card}>{additionalCardsInfo[CARDS[card.id]]}</HomeCard>
          </Grid>
        ))}
      </Grid>
      <Box mt={5}>
        <Grid container spacing={4}>
          {cards.subCards.map((card) => (
            <Grid xs={12} sm item key={card.id}>
              <HomeCard card={card}>{additionalCardsInfo[CARDS[card.id]]}</HomeCard>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
