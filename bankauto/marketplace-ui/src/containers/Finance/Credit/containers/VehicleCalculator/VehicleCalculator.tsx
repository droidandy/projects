import React, { FC, useCallback, useEffect, useMemo } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { calculateMonthlyPaymentWithInsurance, getCreditProgram } from 'helpers/credit';
import { CREDIT_PROGRAM_NAME } from 'constants/credit';
import { useFinanceCreditVehicle } from 'store/finance/credit/vehicle';
import { Constructor } from './components';

interface Props {
  disabled?: boolean;
}

const VehicleCalculator: FC<Props> = ({ disabled = false }) => {
  const {
    term,
    amount,
    vehiclePrice,
    initialPayment,
    setVehiclePrice,
    setInitialPayment,
    setCreditTerm,
    setCreditRate,
    setCreditMonthlyPayment,
    setCreditAmount,
  } = useFinanceCreditVehicle();

  const { isMobile } = useBreakpoints();

  const creditProgram = useMemo(
    () =>
      getCreditProgram({
        vehiclePrice,
        creditAmount: amount,
        programName: CREDIT_PROGRAM_NAME.C2C,
      }),
    [amount, vehiclePrice],
  );

  const handleTermCreditChange = useCallback(
    (months: number) => {
      if (!creditProgram) {
        return;
      }

      const newMonthlyPayment = calculateMonthlyPaymentWithInsurance(
        vehiclePrice - initialPayment,
        months,
        creditProgram.rate,
      );
      setCreditTerm(months);
      setCreditMonthlyPayment(newMonthlyPayment);
    },
    [creditProgram, initialPayment, setCreditMonthlyPayment, setCreditTerm, vehiclePrice],
  );

  const handleVehiclePriceChange = useCallback(
    (newPrice: number) => {
      if (!creditProgram) {
        return;
      }

      const newCreditAmount =
        newPrice < creditProgram.credit.min ? creditProgram.credit.min : Math.ceil(newPrice - initialPayment);

      const newMonthlyPayment = calculateMonthlyPaymentWithInsurance(
        newPrice - initialPayment,
        term,
        creditProgram.rate,
      );

      setCreditAmount(newCreditAmount);
      setCreditMonthlyPayment(newMonthlyPayment);
      setVehiclePrice(newPrice);
    },
    [creditProgram, initialPayment, setCreditAmount, setCreditMonthlyPayment, setVehiclePrice, term],
  );

  const handleInitialPaymentChange = useCallback(
    (newInitialPayment: number) => {
      if (!creditProgram) {
        return;
      }

      const newCreditAmount =
        vehiclePrice < creditProgram.credit.min
          ? creditProgram.credit.min
          : Math.ceil(vehiclePrice - newInitialPayment);
      const newMonthlyPayment = calculateMonthlyPaymentWithInsurance(
        vehiclePrice - newInitialPayment,
        term,
        creditProgram.rate,
      );
      setCreditAmount(newCreditAmount);
      setInitialPayment(newInitialPayment);
      setCreditMonthlyPayment(newMonthlyPayment);

      if (newCreditAmount < creditProgram.credit.min && newInitialPayment) {
        const diff = amount - newCreditAmount;
        setInitialPayment(newInitialPayment - diff);
        setCreditMonthlyPayment(newMonthlyPayment);
      }
    },
    [amount, creditProgram, setCreditAmount, setCreditMonthlyPayment, setInitialPayment, term, vehiclePrice],
  );

  useEffect(() => {
    if (creditProgram?.initialPayment?.min != null && creditProgram?.initialPayment?.min > initialPayment) {
      handleInitialPaymentChange(creditProgram.initialPayment.min);
    }
    if (creditProgram?.initialPayment?.max != null && creditProgram?.initialPayment?.max < initialPayment) {
      handleInitialPaymentChange(creditProgram.initialPayment.max);
    }
  }, [creditProgram, handleInitialPaymentChange, initialPayment, vehiclePrice]);

  useEffect(() => {
    const newMonthlyPayment = calculateMonthlyPaymentWithInsurance(vehiclePrice, term, creditProgram?.rate || 0.069);
    setCreditMonthlyPayment(newMonthlyPayment);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (creditProgram?.rate) {
      setCreditRate(creditProgram?.rate);
    }
  }, [creditProgram?.rate, setCreditRate]);

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
      >
        <Constructor
          vehiclePrice={vehiclePrice}
          term={term}
          initialPayment={initialPayment}
          onInitialPaymentChange={handleInitialPaymentChange}
          onVehiclePriceChange={handleVehiclePriceChange}
          onTermChange={handleTermCreditChange}
          creditProgram={creditProgram}
          disabled={disabled}
        />
        <Box pt={isMobile ? '1.25rem' : '1.75rem'} fontSize="0.75rem" lineHeight="1rem">
          <Typography variant={isMobile ? 'inherit' : 'body1'}>
            * Расчет произведен с учетом финансовой защиты жизни и авто. Не является офертой
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export { VehicleCalculator };
