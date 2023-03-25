import React, { memo } from 'react';
import { useFormState } from 'react-final-form';
import { Button, CircularProgress, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import { VehicleScenarioFieldSet } from './Scenario';

interface Props {
  buttonText: string;
  loading?: boolean;
}

export const VehicleSubmitFieldSet = memo(({ buttonText, loading }: Props) => {
  const { isMobile } = useBreakpoints();
  const { submitFailed, dirtySinceLastSubmit, validating, valid, submitting } = useFormState<VehicleFormSellValues>();
  return (
    <Grid container direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 2 : 4}>
      <Grid item xs={12} sm={6}>
        <VehicleScenarioFieldSet />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          fullWidth
          disabled={loading || submitting || validating || (submitFailed && !valid && !dirtySinceLastSubmit)}
          style={{ maxWidth: '21.5625rem', padding: '1.125rem 0.625rem' }}
          endIcon={(loading || submitting) && <CircularProgress size="1rem" />}
        >
          <Typography variant="h5" component="span">
            {buttonText}
          </Typography>
        </Button>
      </Grid>
    </Grid>
  );
});
