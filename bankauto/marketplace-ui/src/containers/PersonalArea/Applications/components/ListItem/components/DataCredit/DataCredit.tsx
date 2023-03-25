import React, { FC } from 'react';
import { Box, Typography, Grid, PriceFormat, useBreakpoints } from '@marketplace/ui-kit';
import { pluralizeMonth } from 'constants/pluralizeConstants';
import { Chips, Chip } from 'containers/PersonalArea/components';
import { ListItemData } from 'components';

interface Props {
  title?: string;
  subTitle?: string;
  creditAmount: number;
  creditTerm: number;
  monthlyPayment: number;
  rate: number;
  chips?: Chip[];
  bigMargin?: boolean;
}
export const DataCredit: FC<Props> = ({
  title,
  subTitle,
  chips,
  creditAmount,
  creditTerm,
  monthlyPayment,
  rate,
  bigMargin = false,
}) => {
  const { isMobile } = useBreakpoints();
  return (
    <Box mb={isMobile ? '1.25rem' : 0}>
      <Box display="flex" alignItems="flex-start" flexWrap="wrap" flexDirection={isMobile ? 'column' : 'row'}>
        <Box p={isMobile ? '0.625rem 0 0' : '0 0.625rem 0 0'}>
          {!isMobile && title && <Typography variant="h3">{title}</Typography>}
          {subTitle && (
            <Typography variant="subtitle1" style={{ fontWeight: 'bold' }} color="secondary">
              {subTitle}
            </Typography>
          )}
        </Box>
        {chips && (
          <Box pt={1.25}>
            <Chips items={chips} />
          </Box>
        )}
      </Box>
      <Box mt={1.25}>
        <Grid container>
          <Grid item xs={isMobile ? 12 : 5}>
            <ListItemData
              icon="wallet"
              label="Сумма кредита"
              value={<PriceFormat value={creditAmount} bigMargin={bigMargin} />}
            />
          </Grid>

          <Grid item xs={isMobile ? 12 : 7}>
            <Box mt={isMobile ? 2.5 : 0}>
              <ListItemData
                icon="paymentRed"
                label="Ежемесячный платеж"
                value={<PriceFormat value={monthlyPayment} suffix=" ₽/месяц" />}
              />
            </Box>
          </Grid>

          <Grid item xs={isMobile ? 12 : 5}>
            <Box mt={isMobile ? 2.5 : 1.25}>
              <ListItemData
                icon="calendar"
                label="Срок кредита"
                value={<PriceFormat value={creditTerm} suffix={` ${pluralizeMonth(creditTerm)}`} />}
              />
            </Box>
          </Grid>

          <Grid item xs={isMobile ? 12 : 7}>
            <Box mt={isMobile ? 2.5 : 1.25}>
              <ListItemData icon="percent" label="Процентная ставка" value={`${(rate * 100).toFixed(1)} %`} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
