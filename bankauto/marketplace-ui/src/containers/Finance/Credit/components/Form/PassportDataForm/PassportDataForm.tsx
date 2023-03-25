import React, { FC } from 'react';
import { Form } from 'react-final-form';
import * as Yup from 'yup';
import { Box, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { makeValidateSync } from 'components/Fields/validation';
import {
  PersonPassportInfoFieldset,
  PersonPassportInfoFieldsetSchema,
  PersonBirthInfoFieldset,
  PersonBirthInfoFieldsetSchema,
  PersonGenderFieldset,
} from 'components/Fieldsets';
import { Controls } from 'components/Credit';
import { FormBase, PassportData } from 'types/CreditFormDataTypes';

const validationSchema = Yup.object()
  .shape({})
  .concat(PersonPassportInfoFieldsetSchema())
  .concat(PersonBirthInfoFieldsetSchema());
const validate = makeValidateSync(validationSchema);

interface Props extends FormBase<PassportData> {}

const PassportDataForm: FC<Props> = ({ initialValues, onBack, onSubmit, onBlur }) => {
  const { isMobile } = useBreakpoints();

  const INITIAL_VALUES: PassportData = {
    birthPlace: '',
    birthDate: '',
    gender: '',
    passport: '',
    passportIssuedAt: '',
    passportIssuerCode: '',
    passportIssuer: '',
  };

  return (
    <Form validateOnBlur initialValues={initialValues ?? INITIAL_VALUES} onSubmit={onSubmit} validate={validate}>
      {({ handleSubmit, values }) => (
        <form>
          <Grid container direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 4}>
            <PersonBirthInfoFieldset onBlur={() => onBlur?.(values)} />
            <PersonGenderFieldset onBlur={() => onBlur?.(values)} />
          </Grid>
          <Box padding={isMobile ? '1.25rem 0' : '1.625rem 0 1.875rem 0'}>
            <Typography variant="subtitle1">Паспорт</Typography>
          </Box>
          <Grid container direction={isMobile ? 'column' : 'row'} spacing={isMobile ? 1 : 4}>
            <PersonPassportInfoFieldset onBlur={() => onBlur?.(values)} />
          </Grid>
          <Controls approvalPercent={40} onBack={onBack} onSubmit={handleSubmit} />
        </form>
      )}
    </Form>
  );
};

export { PassportDataForm };
