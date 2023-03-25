import { Box, Button, Paper, useBreakpoints, Grid, OmniLink, Typography, Img } from '@marketplace/ui-kit';
import { Divider } from '@material-ui/core';
import { ReactComponent as Icon } from 'icons/iconCheckedGreen.svg';
import { useRouter } from 'next/router';
import React, { FC } from 'react';
import { DebitCardSmall, FilterKey } from 'store/types';
import { ReactComponent as Mastercard } from 'icons/Mastercard.svg';
import { ReactComponent as Mir } from 'icons/Mir.svg';

import { useStyles } from './DebitCardItem.styles';

interface Props {
  item: DebitCardSmall;
}
type Query = Record<FilterKey, 'true' | 'false'>;

const DebitCardItem: FC<Props> = ({ item }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const router = useRouter();
  const query = router.query as Query;

  const qs = Object.keys(query).length ? `/?${new URLSearchParams(query).toString()}` : '';

  const advantages = (
    <>
      {item.advantages.map((advantage, index) => (
        <Box mb={isMobile && '0.625rem'} mt={!isMobile && index && '1.25rem'} display="flex" key={index}>
          <Box mr="0.625rem">
            <Icon />
          </Box>
          <Box>
            <Typography variant={isMobile ? 'body2' : 'body1'}>{advantage}</Typography>
          </Box>
        </Box>
      ))}
    </>
  );

  const bonuses = (
    <>
      {item.bonuses.map((bonus, index) => (
        <Grid item xs={(12 / item.bonuses.length) as 12 | 6} key={index}>
          <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%">
            <Box fontWeight={600} lineHeight="1rem" fontSize="0.75rem">
              <Typography variant={isMobile ? 'inherit' : 'subtitle1'} color="secondary">
                {bonus.title}
              </Typography>
            </Box>
            <Typography variant={isMobile ? 'h6' : 'h4'}>
              {bonus.valueSmallText}
              <Typography className={s.bonusValueBigText} component="span">
                {' '}
                {bonus.valueBigText}{' '}
              </Typography>
              {bonus.valueSmallText2}
            </Typography>
          </Box>
        </Grid>
      ))}
    </>
  );

  const paymentSystems = (
    <Box
      display="flex"
      gridGap="0.625rem"
      mt={isMobile ? '0.625rem' : ''}
      flexDirection={isMobile ? 'row' : 'row-reverse'}
    >
      {item.paymentSystems.includes('mastercard') && <Mastercard className={s.paymentIcon} />}
      {item.paymentSystems.includes('mir') && <Mir className={s.paymentIcon} />}
    </Box>
  );

  return (
    <Box className={s.wrapper}>
      <OmniLink underline="none" href={`/finance/debit-cards/${item.cardName}${qs}`}>
        <Paper elevation={0} variant={isMobile ? 'elevation' : 'outlined'}>
          <Grid container>
            <Grid item xs={12} sm={9}>
              <Box p={isMobile ? '1.875rem 0' : '1.875rem 2.5rem'}>
                <Grid container>
                  <Grid item xs={12} sm={5}>
                    <Box className={s.img}>
                      <Img src={item.img} alt="Дебетовая карта" contain />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <Box m={isMobile ? '1.25rem 0 0' : '0 0 0 2.5rem'}>
                      <Box display="flex" justifyContent="space-between">
                        <Box>
                          <Typography variant={isMobile ? 'body2' : 'body1'} className={s.tags}>
                            {item.tags.join(' • ')}
                          </Typography>
                          <Typography variant={isMobile ? 'h3' : 'h2'} gutterBottom>
                            {item.title}
                          </Typography>
                        </Box>
                        {!isMobile && paymentSystems}
                      </Box>
                      <Typography variant={isMobile ? 'body2' : 'body1'}> {item.shortDescription}</Typography>
                      {isMobile && paymentSystems}
                      <Box mt={isMobile ? '1.25rem' : '0.625rem'}>
                        <Grid container spacing={2}>
                          {bonuses}
                        </Grid>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            <Grid item xs={12} sm={3} className={s.advantagesBlock}>
              {advantages}
            </Grid>
          </Grid>

          {!isMobile && <Divider />}
          <Box m={isMobile ? 0 : '2.5rem'} className={s.details}>
            <Button variant="contained" color="primary" size="large" fullWidth={isMobile}>
              <Box mx={isMobile ? 0 : 7}>
                <Typography variant="h5" component="span">
                  Подробнее
                </Typography>
              </Box>
            </Button>
          </Box>
        </Paper>
      </OmniLink>
    </Box>
  );
};

export { DebitCardItem };
