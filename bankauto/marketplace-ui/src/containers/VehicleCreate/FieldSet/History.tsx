import React, { FC, memo } from 'react';
import { Field } from 'react-final-form';
import { useBreakpoints, InputNumber } from '@marketplace/ui-kit';
import Grid from '@marketplace/ui-kit/components/Grid';
import Select from 'components/Fields/SelectNew';
import { VEHICLE_CONDITION } from 'types/VehicleFormType';

const conditions = [
  { label: 'Отличное', value: VEHICLE_CONDITION.GREAT },
  { label: 'Хорошее', value: VEHICLE_CONDITION.GOOD },
  { label: 'Среднее', value: VEHICLE_CONDITION.MIDDLE },
  { label: 'Требуется ремонт', value: VEHICLE_CONDITION.REPAIR_REQUIRED },
];

export const VehicleHistoryFieldSet: FC = memo(() => {
  const { isMobile } = useBreakpoints();
  return (
    <>
      <Grid container spacing={isMobile ? 2 : 4}>
        <Grid item xs={12} sm={4}>
          <Field name="mileage">
            {({ input, meta }) => (
              <InputNumber
                error={meta.touched && !!meta.error}
                name={input.name}
                value={input.value}
                onBlur={input.onBlur}
                onChange={input.onChange}
                variant="outlined"
                placeholder="Пробег"
                thousandSeparator=" "
                suffix=" км"
                min={1}
                max={1000000}
              />
            )}
          </Field>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select name="condition" placeholder="Состояние" variant="outlined" options={conditions} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Field name="ownersNumber">
            {({ input, meta }) => (
              <InputNumber
                error={meta.touched && !!meta.error}
                name={input.name}
                value={input.value}
                onBlur={input.onBlur}
                onChange={input.onChange}
                variant="outlined"
                placeholder="Количество собственников"
                min={1}
                max={1000}
              />
            )}
          </Field>
        </Grid>
      </Grid>
    </>
  );
});
