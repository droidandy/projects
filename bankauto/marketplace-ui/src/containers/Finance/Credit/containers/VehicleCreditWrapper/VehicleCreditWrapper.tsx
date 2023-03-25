import React, { FC, useRef, useMemo } from 'react';
import { Grid, Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { LinkItem } from '@marketplace/ui-kit/types';
import { useFinanceCreditVehicle } from 'store/finance/credit/vehicle';
import { Documents } from 'containers/Finance/components';
import { Condition } from '../../types/Condition';
import { SafeDeal, VehicleCalculator, VehicleCredit } from '..';
import { CREDIT_TOOLTIPS } from '../../constants/tooltips';
import { MobileSummary, Summary } from '../../components';

interface Props {
  lastCondition: Condition;
  getGuideInfo: JSX.Element | null;
  calculatorDisabled: boolean;
  disableCalculator: (isDisabled?: boolean) => void;
  linkItems: LinkItem[] | null;
}

const VehicleCreditWrapper: FC<Props> = ({
  lastCondition,
  getGuideInfo,
  calculatorDisabled,
  disableCalculator,
  linkItems,
}) => {
  const { isMobile } = useBreakpoints();
  const { amount, monthlyPayment, rate, term } = useFinanceCreditVehicle();
  const formStartPosition = useRef<HTMLDivElement | null>(null);
  const creditFormRef = useRef<HTMLDivElement | null>(null);
  const renderSummary = useMemo(
    () => (
      <Summary
        amount={amount || 0}
        monthlyPayment={monthlyPayment}
        rate={rate || 0}
        term={term}
        tooltips={CREDIT_TOOLTIPS.financeCreditC2CsafeDeal}
        isC2C
      />
    ),
    [amount, monthlyPayment, rate, term],
  );

  return (
    <>
      <SafeDeal />
      <Box mt={isMobile ? '1.25rem' : '3.75rem'}>
        <Grid container spacing={5}>
          <Grid item sm={9} xs={12}>
            {!calculatorDisabled && (
              <Box mb="1.875rem">
                <VehicleCalculator disabled={calculatorDisabled} />
              </Box>
            )}
            {isMobile && <Box mb={calculatorDisabled ? '1.875rem' : '0'}>{renderSummary}</Box>}
            <Box>
              {isMobile && !calculatorDisabled && (
                <MobileSummary
                  amount={amount || 0}
                  monthlyPayment={monthlyPayment}
                  rate={rate || 0}
                  creditFormRef={creditFormRef}
                />
              )}
              <div ref={creditFormRef}>
                <VehicleCredit
                  lastCondition={lastCondition}
                  disableCalculator={disableCalculator}
                  formStartPosition={formStartPosition}
                />
              </div>
            </Box>
          </Grid>
          {!isMobile && (
            <Grid item sm={3} xs={12}>
              {renderSummary}
            </Grid>
          )}
        </Grid>

        <Box m={isMobile ? '1.25rem 0 -0.685rem' : '1.875rem 0 0'}>{getGuideInfo}</Box>

        <Box m={isMobile ? '1.25rem 0 -0.685rem' : '1.875rem 0 0'}>
          <Documents data={linkItems} type="credit" />
        </Box>

        <Box p={isMobile ? '1.25rem 0 2.5rem' : '1.25rem 0 5rem'}>
          <Typography>
            * Расчет носит информационный характер. Итоговый размер кредита / ежемесячного платежа зависит от перечня
            оформленных услуг. Процентная ставка от 5,9 до 13,9% годовых. Размер процентной ставки зависит от наличия
            договора / полиса: добровольного личного страхования (дисконт – 4% для суммы 100 000-1 500 000 руб. или 5%
            для суммы 1 500 001 руб.) и/или страхования ТС (дисконт – 3%) с одной из соответствующих требованиям Банка
            страховых компаний на весь срок действия кредитного договора. Валюта кредита – рубли РФ. Сумма кредита – от
            100 000 до 3 млн руб. Срок кредита – от 12 до 60 месяцев. Погашение кредита – аннуитетными платежами.
            Требуется внесение информации по залогу. Подробнее по телефону 8 (800) 700-11-99. Информация приведена на
            21.04.2021 г. и не является публичной офертой. ПАО «РГС Банк». Генеральная лицензия Банка России №3073.
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export { VehicleCreditWrapper };
