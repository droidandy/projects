import React, { FC } from 'react';
import { Box, Divider, Grid, Paper, PriceFormat, Typography, useBreakpoints, pluralize } from '@marketplace/ui-kit';
import { ReactComponent as IconCalendar } from '@marketplace/ui-kit/icons/icon-calendar.svg';
import { ReactComponent as IconWallet } from '@marketplace/ui-kit/icons/icon-wallet.svg';
import { ReactComponent as IconPercent } from 'icons/Percent.svg';
import { ReactComponent as CurrencyRubIcon } from 'icons/CurrencyRubIcon.svg';
import { InfoTooltip } from 'components';

interface Props {
  amount: number;
  monthlyPayment: number;
  rate: number;
  term: number;
  tooltips?: {
    tooltipPercent?: string;
    tooltipWantLess?: string;
  };
  isC2C?: boolean;
}

const Summary: FC<Props> = ({ amount, monthlyPayment, rate, tooltips, term, isC2C = false }) => {
  const { isMobile } = useBreakpoints();
  return (
    <Box border="1px solid #E8E8E8" borderRadius="0.5rem" position={isMobile ? 'static' : 'sticky'} top="5.25rem">
      <Paper elevation={0}>
        <Grid container direction="column">
          <Grid item xs>
            <Box padding={isMobile ? '1.25rem' : '1.25rem 1.875rem'}>
              <Grid container alignItems="center">
                <Box m={isMobile ? '0 1.5rem 0 0.5rem' : '0 2.375rem 0 0'}>
                  <Grid item>
                    <IconPercent viewBox="0 0 32 32" width="2rem" height="2rem" />
                  </Grid>
                </Box>
                <Grid item>
                  {tooltips?.tooltipPercent && (
                    <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="div">
                      Процентная ставка
                      <InfoTooltip
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        title={
                          <Box color="#fff" fontWeight={isMobile ? 400 : 600}>
                            <Typography variant={isMobile ? 'body2' : 'body1'}>{tooltips.tooltipPercent}</Typography>
                          </Box>
                        }
                      />
                    </Typography>
                  )}
                  <Typography variant={isMobile ? 'h4' : 'h3'} component="div" color="primary">
                    от {(rate * 100).toFixed(1)} %
                  </Typography>
                  {(!isC2C || (isC2C && amount < 1_500_000)) && tooltips?.tooltipWantLess && (
                    <Typography variant={isMobile ? 'h6' : 'h5'} component="div" color="primary">
                      Хочу меньше
                      <InfoTooltip
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        title={
                          <Box color="#fff" fontWeight={isMobile ? 400 : 600}>
                            <Typography variant={isMobile ? 'body2' : 'body1'}>{tooltips.tooltipWantLess}</Typography>
                          </Box>
                        }
                      />
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs>
            <Divider />
          </Grid>
          <Grid item xs>
            <Box padding={isMobile ? '1.25rem' : '1.25rem 1.875rem'}>
              <Grid container alignItems="center">
                <Box m={isMobile ? '0 1.5rem 0 0.5rem' : '0 2.375rem 0 0'}>
                  <Grid item>
                    <IconWallet viewBox="0 0 60 60" width="2rem" height="2rem" />
                  </Grid>
                </Box>
                <Grid item>
                  <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="div">
                    Сумма кредита
                  </Typography>
                  <Typography variant={isMobile ? 'h4' : 'h3'} component="div">
                    <PriceFormat value={amount} />
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs>
            <Divider />
          </Grid>
          <Grid item xs>
            <Box padding={isMobile ? '1.25rem' : '1.25rem 1.875rem'}>
              <Grid container alignItems="center">
                <Box m={isMobile ? '0 1.5rem 0 0.5rem' : '0 2.375rem 0 0'}>
                  <Grid item>
                    <IconCalendar viewBox="0 0 60 60" width="2rem" height="2rem" />
                  </Grid>
                </Box>
                <Grid item>
                  <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="div">
                    Срок кредита
                  </Typography>
                  <Typography variant={isMobile ? 'h4' : 'h3'} component="div">
                    {term} месяц{pluralize(term, ['', 'а', 'ев'])}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs>
            <Divider />
          </Grid>
          <Grid item xs>
            <Box padding={isMobile ? '1.25rem' : '1.25rem 1.875rem'}>
              <Grid container alignItems="center">
                <Box m={isMobile ? '0 1.5rem 0 0.5rem' : '0 2.375rem 0 0'}>
                  <Grid item>
                    <CurrencyRubIcon width="2rem" height="2rem" />
                  </Grid>
                </Box>
                <Grid item>
                  <Typography variant={isMobile ? 'subtitle2' : 'subtitle1'} component="div">
                    Ежемесячный платеж *
                  </Typography>
                  <Typography variant={isMobile ? 'h4' : 'h3'} component="div">
                    от <PriceFormat value={monthlyPayment} />
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export { Summary };
