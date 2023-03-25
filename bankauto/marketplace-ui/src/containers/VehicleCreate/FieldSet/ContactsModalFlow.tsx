import React, { FC, memo, useCallback } from 'react';
import { useField, useForm } from 'react-final-form';
import { ValidationError } from 'yup';
import { Grid, Typography, useBreakpoints, Button, PHONE_INPUT_FORMAT } from '@marketplace/ui-kit';
import { Input } from 'components/Fields';
import { useDispatch } from 'react-redux';
import { actions as userActions } from 'store/user';
import { VehicleFormSellValuesContacts } from 'types/VehicleFormType';
import { RegistrationTypes } from 'types/Authentication';
import { FieldHiddenWithHepler } from './fields/FieldHidden';
import { RegistrationSchema } from './schema';

const hookFieldConfig = { subscription: { touched: true, error: true } };

const CompleteContainerRoot: FC = () => {
  const dispatch = useDispatch();
  const form = useForm<VehicleFormSellValuesContacts>();
  const {
    meta: { error: phoneError, touched: phoneTouched },
  } = useField<string | null>('phone', hookFieldConfig);

  const disabled = phoneError && phoneTouched;

  const handleContinue = useCallback(() => {
    const {
      values: { phone },
    } = form.getState();
    RegistrationSchema.validate({ phone }, { abortEarly: false })
      .then(() => {
        dispatch(userActions.setUserPhone(`+7${phone}`));
        dispatch(
          userActions.changeAuthModalVisibility({
            authModalOpen: true,
            options: {
              shouldAutoSendSms: true,
              phoneEditable: false,
              regType: RegistrationTypes.VEHICLE_C2C,
            },
          }),
        );
      })
      .catch((e: ValidationError) => {
        const errorKeys = e.inner.map((i) => i.path);
        if (form.mutators.setFieldTouched) {
          form.mutators.setFieldTouched(errorKeys);
        }
      });
  }, []);

  return (
    <Button
      onClick={handleContinue}
      type="button"
      variant="contained"
      color="primary"
      size="large"
      fullWidth
      disabled={disabled}
    >
      <Typography variant="h5">Продолжить</Typography>
    </Button>
  );
};

export const VehicleContactsModalFieldSet: FC = memo(() => {
  const { isMobile } = useBreakpoints();

  return (
    <Grid container spacing={isMobile ? 1 : 4}>
      <Grid item sm={4} xs={12}>
        <Input name="phone" placeholder="Телефон" variant="outlined" mask={PHONE_INPUT_FORMAT} />
      </Grid>
      <Grid item sm={4} xs={12}>
        <CompleteContainerRoot />
        <FieldHiddenWithHepler name="authSuccess" />
      </Grid>
    </Grid>
  );
});
