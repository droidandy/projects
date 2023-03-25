import React, { ChangeEvent, FC } from 'react';
import MuiCheckbox from '@material-ui/core/Checkbox';
import { useBreakpoints, Box, Typography, Checkbox, Paper, Grid, Button } from '@marketplace/ui-kit';

import { ReactComponent as Mastercard } from 'icons/Mastercard.svg';
import { ReactComponent as MastercardGrey } from 'icons/MastercardGrey.svg';
import { ReactComponent as MirGrey } from 'icons/MirGrey.svg';
import { ReactComponent as Mir } from 'icons/Mir.svg';

import { pluralizeCard } from 'constants/pluralizeConstants';
import { useRouter } from 'next/router';
import { FilterKey } from 'store/types';
import { useStyles } from './DebitCardFilter.styles';
import { useFilteredItems } from '../../hooks/useFilteredItems';

type Query = Record<FilterKey, 'true' | 'false'>;

interface Props {
  cardNumber: number;
}

const DebitCardFilter: FC<Props> = ({ cardNumber }) => {
  const { isEmpty: isTravelEmpty } = useFilteredItems('travel');
  const { isEmpty: isSavingsEmpty } = useFilteredItems('savings');
  const { isEmpty: isCashbackEmpty } = useFilteredItems('cashback');
  const { isEmpty: isBudgetEmpty } = useFilteredItems('budget');
  const { isEmpty: isMastercardEmpty } = useFilteredItems('mastercard');
  const { isEmpty: isMirEmpty } = useFilteredItems('mir');

  const { isMobile } = useBreakpoints();
  const s = useStyles();
  const router = useRouter();
  let query = router.query as Query;
  const { pathname } = router;

  function handleChange(evt: ChangeEvent<HTMLInputElement>) {
    if (evt.target.name === 'mastercard' || evt.target.name === 'mir') {
      query = {
        ...query,
        mastercard: 'false',
        mir: 'false',
        [evt.target.name]: evt.target.checked.toString(),
      };
    } else {
      query = {
        ...query,
        [evt.target.name]: evt.target.checked.toString(),
      };
    }
    router.push(
      {
        pathname,
        query,
      },
      undefined,
      { shallow: true, scroll: false },
    );
  }

  const setInitState = () => {
    router.push(
      {
        pathname,
      },
      undefined,
      { shallow: true, scroll: false },
    );
  };

  const isChecked = Object.values(query).includes('true');

  const footer = (
    <Box m={isMobile ? '0 1.25rem 1.25rem' : '0'} visibility={isChecked ? 'visible' : 'hidden'}>
      <Box display="flex" flexWrap="wrap" alignItems="baseline">
        <Box mr={isMobile ? '2rem' : '5rem'} fontSize={isMobile ? '0.875rem' : '1.25rem'}>
          <Typography noWrap gutterBottom className={s.fitToYou}>
            Вам подходит{' '}
            <Typography variant={isMobile ? 'subtitle2' : 'h4'} component="span">
              {cardNumber} {pluralizeCard(cardNumber)}
            </Typography>
          </Typography>
        </Box>
        <Box ml={isMobile ? '-0.5rem' : '0'}>
          <Button onClick={setInitState}>
            <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} color="primary" noWrap className={s.showAll}>
              Показать все карты
            </Typography>
          </Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Paper elevation={0} variant={isMobile ? 'elevation' : 'outlined'} className={s.paper}>
      <Grid container>
        <Grid item xs={isMobile ? 12 : 9} className={s.line}>
          <Box p={isMobile ? '1.25rem' : '2.5rem '}>
            <Typography variant={isMobile ? 'h4' : 'h3'} align={isMobile ? 'center' : 'left'} paragraph>
              Выберите вашу карту
            </Typography>
            <Box m={isMobile ? '1.25rem 0' : '1.875rem 0'}>
              <Checkbox
                label={<Typography variant={isMobile ? 'body2' : 'body1'}>Я часто путешествую</Typography>}
                name="travel"
                checked={query.travel === 'true'}
                onChange={handleChange}
                disabled={query.travel !== 'true' && isTravelEmpty}
              />
            </Box>
            <Box m={isMobile ? '1.25rem 0' : '1.875rem 0'}>
              <Checkbox
                label={
                  <Typography variant={isMobile ? 'body2' : 'body1'}>Хочу получать проценты на остаток</Typography>
                }
                name="savings"
                checked={query.savings === 'true'}
                onChange={handleChange}
                disabled={query.savings !== 'true' && isSavingsEmpty}
              />
            </Box>
            <Box m={isMobile ? '1.25rem 0 0' : '1.875rem 0'}>
              <Checkbox
                label={<Typography variant={isMobile ? 'body2' : 'body1'}>Хочу получать кешбэк</Typography>}
                name="cashback"
                checked={query.cashback === 'true'}
                onChange={handleChange}
                disabled={query.cashback !== 'true' && isCashbackEmpty}
              />
            </Box>
            <Box m={isMobile ? '1.25rem 0 0' : '1.875rem 0'}>
              <Checkbox
                label={
                  <Typography variant={isMobile ? 'body2' : 'body1'}>
                    Хочу получать пенсию или другие выплаты из бюджета на карту
                  </Typography>
                }
                name="budget"
                checked={query.budget === 'true'}
                onChange={handleChange}
                disabled={query.budget !== 'true' && isBudgetEmpty}
              />
            </Box>
            {!isMobile && footer}
          </Box>
        </Grid>
        <Grid item xs={isMobile ? 12 : 3}>
          <Box p={isMobile ? '1.25rem' : '2.5rem 1.25rem'}>
            <Typography variant={isMobile ? 'h4' : 'h3'} align={isMobile ? 'center' : 'left'} paragraph>
              Платежная система
            </Typography>
            <Box display="flex" justifyContent={isMobile ? 'center' : 'start'}>
              <MuiCheckbox
                className={s.checkboxImg}
                icon={<MastercardGrey width="5.625rem" height="4.25rem" />}
                checkedIcon={<Mastercard width="5.625rem" height="4.25rem" />}
                name="mastercard"
                checked={query.mastercard === 'true'}
                onChange={handleChange}
                disabled={query.mastercard !== 'true' && isMastercardEmpty}
              />

              <MuiCheckbox
                className={s.checkboxImg}
                icon={<MirGrey width="5.625rem" height="4.25rem" />}
                checkedIcon={<Mir width="5.625rem" height="4.25rem" />}
                name="mir"
                checked={query.mir === 'true'}
                onChange={handleChange}
                disabled={query.mir !== 'true' && isMirEmpty}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>

      {isMobile && footer}
    </Paper>
  );
};

export { DebitCardFilter };
