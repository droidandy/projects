import React, { FC, useEffect, useMemo } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useFinanceCreditStandalone } from 'store/finance/credit/standalone';
import { calculateMonthlyPaymentWithInsurance, getCreditProgram } from 'helpers/credit';
import { CREDIT_PROGRAM_NAME } from 'constants/credit';
import { CreditPurpose } from 'types/CreditPurpose';
import { Constructor } from './components';

interface Props {
  justMoney?: boolean;
  isC2C?: boolean;
  isSafeDeal?: boolean;
  setIsSafeDeal?: React.Dispatch<React.SetStateAction<boolean>>;
  disabled?: boolean;
  creditPurpose?: CreditPurpose;
}

const StandaloneCalculator: FC<Props> = ({ justMoney = false, isC2C = false, disabled = false, creditPurpose }) => {
  const {
    term,
    amount,
    vehiclePrice,
    initialPayment,
    rate,
    setCreditTerm,
    setCreditAmount,
    setVehiclePrice,
    setMonthlyPayment,
    setRate,
    setInitialPayment,
  } = useFinanceCreditStandalone();

  const { isMobile } = useBreakpoints();

  const creditProgram = useMemo(() => {
    return getCreditProgram({
      programName: CREDIT_PROGRAM_NAME.HYBRID,
      creditAmount: justMoney ? amount : vehiclePrice,
      justMoney: justMoney && creditPurpose !== CreditPurpose.BUYING_VEHICLE,
      isC2C,
      initialPayment,
    });
  }, [justMoney, amount, vehiclePrice, creditPurpose, isC2C, initialPayment]);

  const handleInitialPaymentChange = (payment: number) => {
    setInitialPayment(payment);
  };

  const handleTermChange = (payment: number) => {
    setCreditTerm(payment);
  };

  const handleSumChange = (sum: number) => {
    if (creditProgram?.credit) {
      const currentSum = sum < creditProgram.credit.min ? creditProgram.credit.min : sum;
      if (justMoney) {
        setCreditAmount(currentSum);
      } else {
        setVehiclePrice(currentSum);
      }
    }
  };

  const sum = useMemo(() => {
    if (!creditProgram) return null;
    const finalSum = justMoney ? amount : vehiclePrice - initialPayment;
    if (finalSum < creditProgram.credit.min) return creditProgram.credit.min;
    if (finalSum > 3_000_000) return 3_000_000;
    return finalSum;
  }, [justMoney, vehiclePrice, initialPayment, amount, creditProgram]);

  // TODO: необходим рефакторинг
  useEffect(() => {
    if (!creditProgram) return;
    setRate(creditProgram.rate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [creditProgram?.rate]);

  useEffect(() => {
    if (!sum) return;
    setMonthlyPayment(calculateMonthlyPaymentWithInsurance(sum, term, rate));
    if (creditProgram?.initialPayment) {
      if (initialPayment < creditProgram.initialPayment.min) {
        setInitialPayment(creditProgram.initialPayment.min);
      }
      if (initialPayment > creditProgram.initialPayment.max) {
        setInitialPayment(creditProgram.initialPayment.max);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sum, term, initialPayment, setMonthlyPayment, rate, creditProgram?.initialPayment]);

  return (
    <>
      <Box
        borderRadius="0.5rem 0.5rem 0 0"
        bgcolor={!isMobile && '#E7E7E7'}
        p={isMobile ? '1.25rem' : '2rem 2.5rem 2.375rem'}
      >
        <Typography variant="h4" component="h2" align={isMobile ? 'center' : 'left'}>
          Рассчитайте свой кредит
        </Typography>
      </Box>
      <Box
        height="100%"
        border="1px solid"
        borderColor="grey.200"
        borderRadius={isMobile ? '0.5rem' : '0 0 0.5rem 0.5rem'}
        p={isMobile ? '1.125rem 1.25rem 1.25rem' : '1.5rem 2.5rem 2.5rem'}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
      >
        <Box>
          {creditProgram && (
            <Constructor
              initialPayment={creditProgram.currentInitialPayment ?? 0}
              setInitialPayment={handleInitialPaymentChange}
              amount={justMoney ? amount : vehiclePrice}
              term={term}
              onAmountChange={handleSumChange}
              onTermChange={handleTermChange}
              creditProgram={creditProgram}
              justMoney={justMoney}
              disabled={disabled}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export { StandaloneCalculator };
