import React, { memo } from 'react';
import { Field } from 'react-final-form';
import { Grid, Box, Typography, InputVehicleVIN, useBreakpoints } from '@marketplace/ui-kit';

export const VehicleVINFieldSet = memo(() => {
  const { isMobile } = useBreakpoints();

  return (
    <Grid container spacing={isMobile ? 0 : 4}>
      <Grid item xs={12} sm={4}>
        <Field name="vin">
          {({ input, meta }) => (
            <InputVehicleVIN
              variant="outlined"
              error={meta.touched && !!meta.error}
              helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
              name={input.name}
              value={input.value}
              onBlur={input.onBlur}
              onChange={input.onChange}
              maskPlaceholder={null}
            />
          )}
        </Field>
      </Grid>
      <Grid item xs={12} sm={8} style={{ display: 'flex' }} alignItems="center">
        <Box pt={isMobile ? 1.25 : 0}>
          <Typography variant="subtitle2" component="p">
            Необходим в случае продажи автомобиля частному лицу
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
});
