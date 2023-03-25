import React, { FC, useRef, useState, useEffect, useMemo } from 'react';
import { Grid, Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { LinkItem } from '@marketplace/ui-kit/types';
import { useFinanceCreditStandalone } from 'store/finance/credit/standalone';
import { Documents } from 'containers/Finance/components';
import { CreditPurpose } from 'types/CreditPurpose';
import { Condition } from '../../types/Condition';
import { StandaloneCalculator, StandaloneCredit } from '..';
import { CREDIT_TOOLTIPS } from '../../constants/tooltips';
import { MobileSummary, Summary } from '../../components';

interface Props {
  lastCondition: Condition;
  getGuideInfo: JSX.Element | null;
  calculatorDisabled: boolean;
  disableCalculator: (isDisabled?: boolean) => void;
  linkItems: LinkItem[] | null;
}

const SimpleCreditWrapper: FC<Props> = ({
  lastCondition,
  getGuideInfo,
  calculatorDisabled,
  disableCalculator,
  linkItems,
}) => {
  const { isMobile } = useBreakpoints();
  const { amount, vehiclePrice, monthlyPayment, rate, term, initialPayment } = useFinanceCreditStandalone();
  const formStartPosition = useRef<HTMLDivElement | null>(null);
  const creditFormRef = useRef<HTMLDivElement | null>(null);
  const [creditPurpose, setCreditPurpose] = useState(CreditPurpose.NONE);
  const justMoney = useMemo(() => lastCondition === Condition.JUST_MONEY, [lastCondition]);
  const currentAmount = useMemo(
    () => (justMoney ? amount : vehiclePrice - initialPayment) || 0,
    [justMoney, amount, vehiclePrice, initialPayment],
  );
  const renderSummary = useMemo(
    () => (
      <Summary
        amount={currentAmount}
        monthlyPayment={monthlyPayment}
        rate={rate || 0}
        term={term}
        tooltips={
          lastCondition === Condition.AUTHORIZED_DEALER || creditPurpose === CreditPurpose.BUYING_VEHICLE
            ? CREDIT_TOOLTIPS.financeStandaloneAutoCredit
            : CREDIT_TOOLTIPS.financeStandaloneCredit
        }
      />
    ),
    [currentAmount, creditPurpose, lastCondition, monthlyPayment, rate, term],
  );

  useEffect(() => {
    setCreditPurpose(CreditPurpose.NONE);
  }, [lastCondition]);

  return (
    <>
      <Box m="1.25rem 0 1.25rem">
        <Grid container spacing={isMobile ? 2 : 5}>
          <Grid item sm={9} xs={12}>
            {!calculatorDisabled && (
              <Box mb="1.875rem">
                <StandaloneCalculator
                  disabled={calculatorDisabled}
                  justMoney={justMoney}
                  creditPurpose={creditPurpose}
                />
              </Box>
            )}
            {isMobile && <Box mb={calculatorDisabled ? '1.875rem' : '0'}>{renderSummary}</Box>}
            <Box>
              {isMobile && !calculatorDisabled && (
                <MobileSummary
                  amount={currentAmount}
                  monthlyPayment={monthlyPayment}
                  rate={rate || 0}
                  creditFormRef={creditFormRef}
                />
              )}
              <div ref={creditFormRef}>
                <StandaloneCredit
                  lastCondition={lastCondition}
                  disableCalculator={disableCalculator}
                  formStartPosition={formStartPosition}
                  creditPurpose={creditPurpose}
                  setCreditPurpose={lastCondition === Condition.JUST_MONEY ? setCreditPurpose : undefined}
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
            {lastCondition === Condition.AUTHORIZED_DEALER || creditPurpose === CreditPurpose.BUYING_VEHICLE
              ? `* 3,9% годовых – минимальная процентная ставка (ПС) по тарифу «Гибридный кредит», которая образуется с учетом дисконта в размере 4% к ПС в случае, если ТС будет предоставлено в залог Банку после получения Кредита, и при условии оформления договора добровольного личного страхования с одной из соответствующих требованиям Банка страховых компаний; максимальная ставка – 20,8% годовых. При наличии договора страхования и отсутствия дисконта за предоставление авто в залог: ПС – от 7,9 до 18,8% годовых. Без дисконтов за предоставление авто в залог и оформление страховки: ПС – от 9,9 до 20,8% годовых. Размер процентной ставки определяется ПАО «РГС Банк» индивидуально в указанных интервалах и зависит от риск-профиля заемщика. Валюта кредита: рубли РФ. Срок кредита: 13–60 месяцев. Сумма кредита: 50 тыс. – 3 млн руб. Погашение кредита – аннуитетными платежами. На сумму кредита свыше 500 тыс. руб. дополнительно требуется документ, подтверждающий размер ежемесячного дохода. Подробнее на www.rgsbank.ru и по телефону 8 (800) 700-11-99. Информация приведена на 27.09.2021 и не является публичной офертой.
              
              ПАО «РГС Банк». Генеральная лицензия Банка России №3073.`
              : `* 7,9% годовых – минимальная процентная ставка (ПС) по тарифу «Гибридный кредит» при условии оформления договора добровольного личного страхования с одной из соответствующих требованиям Банка страховых компаний; максимальная ставка – 18,8% годовых. Без дисконтов за предоставление авто в залог и оформления добровольного личного страхования: ПС – от 9,9 до 20,8% годовых. Размер процентной ставки определяется ПАО «РГС Банк» индивидуально в указанных интервалах и зависит от риск-профиля заемщика. Валюта кредита: рубли РФ. Срок кредита: 13–60 месяцев. Сумма кредита: 50 тыс. – 3 млн руб. Погашение кредита – аннуитетными платежами. На сумму кредита свыше 500 тыс. руб. дополнительно требуется документ, подтверждающий размер ежемесячного дохода. Подробнее на www.rgsbank.ru и по телефону 8 (800) 700-11-99. Информация приведена на 27.09.2021 и не является публичной офертой.
              
              ПАО «РГС Банк». Ген. лицензия Банка России № 3073.`}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export { SimpleCreditWrapper };
