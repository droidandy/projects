import React, { FC, SyntheticEvent } from 'react';
import { Box, PriceFormat, useBreakpoints } from '@marketplace/ui-kit';
import { EntityInputSlider } from 'components/EntityInputSlider';
import { InfoCheckbox } from 'components/InfoCheckbox';
import {
  DEPOSIT_MAX_AMOUNT,
  DEPOSIT_MIN_AMOUNT,
  DEPOSIT_MAP,
  DEPOSIT_MIN_TERM,
  DEPOSIT_MAX_TERM,
} from 'constants/deposit';
import { pluralizeMonth } from 'constants/pluralizeConstants';

interface Props {
  amount: number;
  term: number;
  refill: boolean;
  withdrawal: boolean;
  withoutPercentWithdrawal: boolean;
  onAmountChange: (value: number) => void;
  onTermChange: (value: number) => void;
  onRefillChange: (value: boolean) => void;
  onWithdrawalChange: (value: boolean) => void;
  onWithoutPercentWithdrawalChange: (value: boolean) => void;
}

const Constructor: FC<Props> = ({
  amount,
  term,
  refill,
  withdrawal,
  withoutPercentWithdrawal,
  onAmountChange,
  onTermChange,
  onRefillChange,
  // onWithdrawalChange,
  onWithoutPercentWithdrawalChange,
}) => {
  const { isMobile } = useBreakpoints();

  const handleRefillChange = (event: SyntheticEvent) => {
    const input = event.target as HTMLInputElement;
    onRefillChange(input.checked);
  };

  // const handleWithdrawalChange = (event: SyntheticEvent) => {
  //   const input = event.target as HTMLInputElement;
  //   onWithdrawalChange(input.checked);
  // };

  const handleWithoutPercentWithdrawalChange = (event: SyntheticEvent) => {
    const input = event.target as HTMLInputElement;
    onWithoutPercentWithdrawalChange(input.checked);
  };

  return (
    <>
      <Box>
        <EntityInputSlider
          mb={isMobile ? 2.5 : 5}
          nonLinear
          map={DEPOSIT_MAP}
          editable
          suffix=" ₽"
          label="Сумма&nbsp;вклада"
          value={amount}
          min={{
            value: DEPOSIT_MIN_AMOUNT,
            label: (
              <>
                От <PriceFormat value={DEPOSIT_MIN_AMOUNT} suffix="" />
              </>
            ),
          }}
          max={{
            value: DEPOSIT_MAX_AMOUNT,
            label: (
              <>
                До <PriceFormat value={DEPOSIT_MAX_AMOUNT} suffix="" />{' '}
              </>
            ),
          }}
          onAmountChange={onAmountChange}
        />

        <EntityInputSlider
          mb={isMobile ? 3.5 : 7.5}
          editable
          suffix={` ${pluralizeMonth(term)}`}
          label="Срок&nbsp;вклада"
          value={term}
          min={{
            value: DEPOSIT_MIN_TERM,
            label: `От ${DEPOSIT_MIN_TERM} месяцев`,
          }}
          max={{
            value: DEPOSIT_MAX_TERM,
            label: `До ${DEPOSIT_MAX_TERM} месяцев`,
          }}
          onAmountChange={onTermChange}
        />
      </Box>

      <Box display="flex" mt={isMobile ? 2.5 : 5} flexDirection={isMobile ? 'column' : 'row'}>
        <Box mr={isMobile ? 0 : 5}>
          <InfoCheckbox
            label="С&nbsp;пополнением"
            text="Пополнение в течение всего срока действия Вклада"
            checked={refill}
            disabled={withdrawal}
            onChange={handleRefillChange}
          />
        </Box>
        {/*<Box mr={isMobile ? 0 : 5} mt={isMobile ? '0.625rem' : 0}>*/}
        {/*  <InfoCheckbox*/}
        {/*    label="С&nbsp;частичным&nbsp;снятием"*/}
        {/*    text="Возможность снятия денежных средств до суммы неснижаемого остатка по вкладу"*/}
        {/*    checked={withdrawal}*/}
        {/*    onChange={handleWithdrawalChange}*/}
        {/*  />*/}
        {/*</Box>*/}
        <Box mr={isMobile ? 0 : '-4rem'} mt={isMobile ? '0.625rem' : 0}>
          <InfoCheckbox
            label={
              isMobile ? (
                <>
                  Без вывода процентов <br />
                  (капитализация)
                </>
              ) : (
                'Без вывода процентов (капитализация)'
              )
            }
            text="Повышение процентной ставки в случае выбора способа получения процентов в конце срока вклада"
            checked={withoutPercentWithdrawal}
            onChange={handleWithoutPercentWithdrawalChange}
          />
        </Box>
      </Box>
    </>
  );
};

export { Constructor };
