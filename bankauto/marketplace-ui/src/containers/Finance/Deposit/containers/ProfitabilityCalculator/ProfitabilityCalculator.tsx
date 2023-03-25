import React, { FC, useEffect, useState } from 'react';
import { Box, ContainerWrapper, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useDepositCalculator } from 'store';
import { DepositOptions } from '@marketplace/ui-kit/types';
import { EXPENSES_TYPE_MAP } from 'containers/Finance/Deposit/constants/expensesTypeMap';
import { Constructor, Summary } from './components';

interface Props {
  onSubmit: () => void;
}

const ProfitabilityCalculator: FC<Props> = ({ onSubmit }) => {
  const { isMobile } = useBreakpoints();
  const {
    amount,
    term,
    refill,
    withdrawal,
    withoutPercentWithdrawal,
    depositRate,
    addition,
    loading,
    error,
    fetchDepositRates,
    setAmount,
    setTerm,
    setRefill,
    setWithdrawal,
    setWithoutPercentWithdrawal,
  } = useDepositCalculator();

  const [expensesType, setExpensesType] = useState(2);

  useEffect(() => {
    let options = DepositOptions.NoRefillNoWithdrawal;
    if (refill && !withdrawal) {
      options = DepositOptions.NoRefillWithWithdrawal;
    } else if (refill && withdrawal) {
      options = DepositOptions.WithRefillWithWithdrawal;
    }

    fetchDepositRates({ term, options, turnover: EXPENSES_TYPE_MAP[expensesType] });
  }, [refill, withdrawal, term, expensesType, fetchDepositRates]);

  return (
    <ContainerWrapper>
      <Box mb={isMobile ? '1.25rem' : '1.625rem'}>
        <Typography variant={isMobile ? 'h4' : 'h2'} component="h2" align={isMobile ? 'center' : 'left'}>
          Калькулятор доходности
        </Typography>
      </Box>
      <Grid container>
        <Grid item sm={8} xs={12}>
          <Box
            border="1px solid"
            borderColor="grey.200"
            borderRadius="0.5rem"
            p={isMobile ? '1.875rem 1.25rem 1.25rem' : 7.5}
            mr={isMobile ? 0 : '2.5rem'}
            mb={isMobile ? '1.25rem' : 0}
          >
            <Constructor
              amount={amount}
              term={term}
              refill={refill}
              withdrawal={withdrawal}
              withoutPercentWithdrawal={withoutPercentWithdrawal}
              onAmountChange={setAmount}
              onTermChange={setTerm}
              onRefillChange={setRefill}
              onWithdrawalChange={setWithdrawal}
              onWithoutPercentWithdrawalChange={setWithoutPercentWithdrawal}
            />
          </Box>
        </Grid>
        <Grid item sm={4} xs={12}>
          <Box border="1px solid" borderColor="grey.200" borderRadius="0.5rem" p={isMobile ? '1.25rem' : '2.5rem'}>
            <Summary
              amount={amount}
              term={term}
              withoutPercentWithdrawal={withoutPercentWithdrawal}
              onSubmit={onSubmit}
              depositRate={depositRate}
              addition={addition}
              expensesType={expensesType}
              setExpensesType={setExpensesType}
              loading={loading}
              error={error}
            />
          </Box>
        </Grid>
      </Grid>
    </ContainerWrapper>
  );
};

export { ProfitabilityCalculator };
