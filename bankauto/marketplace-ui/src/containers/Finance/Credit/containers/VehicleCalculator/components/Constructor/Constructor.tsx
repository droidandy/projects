import React, { FC } from 'react';
import { Box, Grid, pluralize, PriceFormat, useBreakpoints } from '@marketplace/ui-kit';
import { EntityInputSlider } from 'components/EntityInputSlider';
import { CREDIT_INFO } from 'constants/credit';
import { CreditProgram } from 'types/CreditProgram';

interface Props {
  vehiclePrice: number;
  term: number;
  initialPayment: number;
  creditProgram: CreditProgram | null;
  onVehiclePriceChange: (value: number) => void;
  onTermChange: (value: number) => void;
  onInitialPaymentChange: (value: number) => void;
  disabled?: boolean;
}

const AMOUNT_STEP = 10000;

const Constructor: FC<Props> = ({
  vehiclePrice,
  term,
  initialPayment,
  creditProgram,
  onVehiclePriceChange,
  onTermChange,
  onInitialPaymentChange,
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
            label="Стоимость автомобиля"
            value={vehiclePrice}
            min={{
              value: CREDIT_INFO.minVehicleUsedPrice,
              label: <PriceFormat value={CREDIT_INFO.minVehicleUsedPrice} />,
            }}
            max={{
              value: CREDIT_INFO.maxVehiclePrice,
              label: <PriceFormat value={CREDIT_INFO.maxVehiclePrice} />,
            }}
            step={AMOUNT_STEP}
            disabled={disabled}
            onAmountChange={onVehiclePriceChange}
          />
        </Grid>
      </Box>
      <Box mb={isMobile ? '1.25rem' : '1.875rem'}>
        <Grid item>
          <EntityInputSlider
            editable
            suffix=" ₽"
            label="Первоначальный взнос"
            value={initialPayment}
            min={{
              value: creditProgram?.initialPayment?.min ?? 0,
              label: <PriceFormat value={creditProgram?.initialPayment?.min ?? 0} />,
            }}
            max={{
              value: creditProgram?.initialPayment?.max ?? 0,
              label: <PriceFormat value={creditProgram?.initialPayment?.max ?? 0} />,
            }}
            step={AMOUNT_STEP}
            onAmountChange={onInitialPaymentChange}
            disabled={
              disabled ||
              creditProgram?.initialPayment?.max === 0 ||
              creditProgram?.initialPayment?.min === creditProgram?.initialPayment?.max
            }
          />
        </Grid>
      </Box>
      <Box>
        <Grid item>
          <EntityInputSlider
            editable
            label="Срок кредита"
            suffix={pluralize(term, [' месяц', ' месяца', ' месяцев'])}
            value={term}
            step={6}
            min={{
              value: creditProgram?.term?.min ?? 0,
              label: `${creditProgram?.term?.min ?? 0} месяц${pluralize(creditProgram?.term?.min ?? 0, [
                '',
                'а',
                'ев',
              ])}`,
            }}
            max={{
              value: creditProgram?.term?.max ?? 0,
              label: `${creditProgram?.term?.max ?? 0} месяц${pluralize(creditProgram?.term?.max ?? 0, [
                '',
                'а',
                'ев',
              ])}`,
            }}
            disabled={disabled}
            onAmountChange={onTermChange}
          />
        </Grid>
      </Box>
    </>
  );
};

export { Constructor };
