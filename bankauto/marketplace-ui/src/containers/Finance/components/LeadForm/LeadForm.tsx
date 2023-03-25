import React, { FC } from 'react';
import { Box, Button, CircularProgress, OmniLink, PHONE_INPUT_FORMAT, Typography } from '@marketplace/ui-kit';
import { LeadFormData } from 'types/LeadFormData';
import { FormHelperText } from '@material-ui/core';
import { Form as FinalForm, Field } from 'react-final-form';
import { Checkbox, Input } from 'components/Fields';
import { makeValidateSync } from 'components/Fields/validation';
import { licenseDocumentsLinksFinance } from 'constants/licenseDocumentsLinks';
import { LeadFormSchema } from './LeadForm.schema';
import { useStyles } from './LeadForm.styles';

const validate = makeValidateSync(LeadFormSchema);

const INITIAL_VALUES = {
  name: '',
  phone: '',
  acceptTerms: false,
};

interface Props {
  loading?: boolean;
  onSubmit: (data: LeadFormData) => void;
}

const LeadForm: FC<Props> = ({ loading = false, onSubmit }) => {
  const s = useStyles();

  const label = (
    <Typography variant="body2">
      Я принимаю{' '}
      <OmniLink href={licenseDocumentsLinksFinance.agreement} rel="noreferrer" target="_blank">
        условия использования
      </OmniLink>{' '}
      сервиса и даю{' '}
      <OmniLink href={licenseDocumentsLinksFinance.personalData} rel="noreferrer" target="_blank">
        согласие{' '}
      </OmniLink>{' '}
      на обработку персональных данных
    </Typography>
  );

  return (
    <FinalForm onSubmit={onSubmit} initialValues={INITIAL_VALUES} validate={validate}>
      {({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={s.root}>
          <Input capitalize placeholder="Имя" name="name" className={s.name} variant="outlined" />
          <Input name="phone" placeholder="Телефон" variant="outlined" mask={PHONE_INPUT_FORMAT} />
          <Field name="acceptTerms" type="checkbox">
            {({ input, meta }) => (
              <Box className={s.checkboxWrapper}>
                <Checkbox
                  label={label}
                  checked={input.checked}
                  onChange={input.onChange}
                  className={s.checkbox}
                  name="acceptTerms"
                />
                {!!meta.touched && !!meta.error && (
                  <FormHelperText className={s.checkboxError} error>
                    {meta.error[0]}
                  </FormHelperText>
                )}
              </Box>
            )}
          </Field>
          <Button type="submit" variant="contained" className={s.submitButton} color="primary" disabled={loading}>
            {loading && (
              <Box position="absolute" left="calc(50% - 1rem)" top="calc(50% - 1rem)">
                <CircularProgress size="2rem" />
              </Box>
            )}
            Отправить заявку
          </Button>
        </form>
      )}
    </FinalForm>
  );
};

export { LeadForm };
