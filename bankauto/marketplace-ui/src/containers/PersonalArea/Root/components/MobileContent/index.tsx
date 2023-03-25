import React, { FC, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { Box, Typography } from '@marketplace/ui-kit';
import { logout } from 'store/user';
import { LinkButton } from '../LinkButton';
import { getCardsData } from '../../helpers/getCardsData';

export const MobileContent: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const cards = useMemo(() => getCardsData(undefined, true), []);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h4" component="h1">
          Мой кабинет
        </Typography>
        <Typography color="primary" variant="h5" component="span" onClick={handleLogout}>
          Выйти
        </Typography>
      </Box>
      <Box pt={2.5}>
        {cards.mainCards.map((card) => (
          <Box pb={1.25} key={card.id}>
            <LinkButton card={card} />
          </Box>
        ))}
        {cards.subCards.map((card) => (
          <Box pb={1.25} key={card.id}>
            <LinkButton card={card} />
          </Box>
        ))}
      </Box>
    </>
  );
};
