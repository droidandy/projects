import React, { FC } from 'react';
import { Box, Grid, pluralize, PriceFormat, useBreakpoints } from '@marketplace/ui-kit';
import { EntityInputSlider } from 'components/EntityInputSlider';
import { CreditProgram } from 'types/CreditProgram';

interface Props {
  justMoney?: boolean;
  initialPayment: number;
  creditProgram: CreditProgram;
  setInitialPayment: (value: number) => void;
  amount: number;
  term: number;
  disabled?: boolean;
  onAmountChange: (value: number) => void;
  onTermChange: (value: number) => void;
}

const AMOUNT_STEP = 10000;

const ConstructorComponent: FC<Props> = ({
  justMoney,
  creditProgram,
  amount,
  term,
  onAmountChange,
  onTermChange,
  initialPayment,
  setInitialPayment,
  disabled = false,
}) => {
  const { isMobile } = useBreakpoints();
  return (
    <>
      <Box mb={isMobile ? '1.25rem' : '2rem'}>
        <Grid item>
          <EntityInputSlider
            editable
            suffix=" ₽"
            label={justMoney ? 'Сумма кредита' : 'Стоимость автомобиля'}
            value={amount}
            min={{
              value: creditProgram.credit.min,
              label: <PriceFormat value={creditProgram.credit.min} />,
            }}
            max={{
              value: creditProgram.credit.max,
              label: <PriceFormat value={creditProgram.credit.max} />,
            }}
            step={AMOUNT_STEP}
            disabled={disabled}
            onAmountChange={onAmountChange}
          />
        </Grid>
      </Box>
      {!justMoney && (
        <Box mb={isMobile ? '1.25rem' : '1.875rem'}>
          <Grid item>
            <EntityInputSlider
              editable
              suffix=" ₽"
              label="Первоначальный взнос"
              value={initialPayment}
              min={{
                value: creditProgram.initialPayment?.min || 0,
                label: <PriceFormat value={creditProgram.initialPayment?.min} />,
              }}
              max={{
                value: creditProgram.initialPayment?.max || 0,
                label: <PriceFormat value={creditProgram.initialPayment?.max} />,
              }}
              step={AMOUNT_STEP}
              onAmountChange={setInitialPayment}
              disabled={
                disabled ||
                creditProgram.initialPayment?.max === 0 ||
                creditProgram.initialPayment?.min === creditProgram.initialPayment?.max
              }
            />
          </Grid>
        </Box>
      )}
      <Box>
        <Grid item>
          <EntityInputSlider
            editable
            label="Срок кредита"
            suffix={pluralize(term, [' месяц', ' месяца', ' месяцев'])}
            value={term}
            step={1}
            min={{
              value: creditProgram.term.min,
              label: `${creditProgram.term.min} месяц${pluralize(creditProgram.term.min, ['', 'а', 'ев'])}`,
            }}
            max={{
              value: creditProgram.term.max,
              label: `${creditProgram.term.max} месяц${pluralize(creditProgram.term.max, ['', 'а', 'ев'])}`,
            }}
            disabled={disabled}
            onAmountChange={onTermChange}
          />
        </Grid>
      </Box>
    </>
  );
};

function areEqual({ justMoney, amount, initialPayment, term, disabled }: Props, nextProps: Props) {
  // Чтобы уменьшить кол-во ререндеров ограничил количество свойств по которым происходит рендер
  return (
    justMoney === nextProps.justMoney &&
    amount === nextProps.amount &&
    initialPayment === nextProps.initialPayment &&
    term === nextProps.term &&
    disabled === nextProps.disabled
  );
}

const Constructor: FC<Props> = React.memo(ConstructorComponent, areEqual);

export { Constructor };
