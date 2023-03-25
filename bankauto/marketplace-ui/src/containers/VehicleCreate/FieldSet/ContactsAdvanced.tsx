import React, { FC, memo } from 'react';
import { Field } from 'react-final-form';
import { Grid, InputBase, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { SelectNew as Select } from 'components/Fields';
import { useFormVehicleContext } from 'containers/VehicleCreate/FormContext';

const hours = new Array(23)
  .fill({ label: '', value: 0 })
  .map((item, index) => ({ label: `${index + 1}:00`, value: index + 1 }));

export const VehicleContactsAdvancedFieldSet: FC = memo(() => {
  const { isMobile } = useBreakpoints();
  const { id: isEdition } = useFormVehicleContext();

  return (
    <Grid container spacing={isMobile ? 1 : 4}>
      <Grid item sm={4} xs={12}>
        <Grid container spacing={isMobile ? 1 : 2}>
          <Grid item xs={6}>
            <Select name="meetFrom" placeholder="Звонить с" variant="outlined" options={hours} />
          </Grid>
          <Grid item xs={6}>
            <Select name="meetTo" placeholder="По" variant="outlined" options={hours} />
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={4} xs={12}>
        <Field name="email">
          {({ input, meta }) => (
            <InputBase
              label="Email"
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
              InputProps={{
                endAdornment: (
                  <Typography variant="caption" color="textSecondary">
                    Необязательно
                  </Typography>
                ),
              }}
              disabled={!!isEdition}
              {...input}
            />
          )}
        </Field>
      </Grid>
    </Grid>
  );
});
