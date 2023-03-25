import React, { FC, useCallback, useEffect } from 'react';
import { Form, useField, useForm } from 'react-final-form';
import * as Yup from 'yup';
import { Box, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { getSuggestedAddresses } from 'api/dadata';
import { makeValidateSync } from 'components/Fields/validation';
import {
  PersonPassportInfoFieldset,
  PersonPassportInfoFieldsetSchema,
  PersonBirthInfoFieldset,
  PersonBirthInfoFieldsetSchema,
  AddressFieldset,
  AddressFieldsetSchema,
  PersonGenderFieldset,
  PersonGenderFieldsetSchema,
} from 'components/Fieldsets';
import { Controls } from 'components/Credit';
import { AddressData, FormBase, PassportAndAddressData, PassportData } from 'types/CreditFormDataTypes';

const useFieldValue = (name: string) => {
  const {
    input: { value },
  } = useField(name, { subscription: { value: true } });
  return value;
};

const INITIAL_VALUES: PassportData & AddressData = {
  birthPlace: '',
  birthDate: '',
  gender: '',
  passport: '',
  passportIssuedAt: '',
  passportIssuerCode: '',
  passportIssuer: '',
  regAddress: null,
  factAddress: null,
  addressMatches: false,
};

interface Props extends FormBase<PassportAndAddressData> {
  isLoading: boolean;
  isSimpleCredit?: boolean;
}

const FormContent: FC<Omit<Props, 'onSubmit'> & { onSubmit: () => void; values: PassportAndAddressData }> = ({
  onBack,
  onSubmit,
  onBlur,
  isLoading,
  values,
  isSimpleCredit,
}) => {
  const { isMobile } = useBreakpoints();

  const loadAddressOptions = useCallback(async (query) => {
    const { data } = await getSuggestedAddresses(query);
    return data.map((address) => ({ label: address.value, value: address }));
  }, []);
  const form = useForm();

  const addressMatches = useFieldValue('addressMatches');
  const regAddress = useFieldValue('regAddress');

  useEffect(() => {
    if (!addressMatches || !regAddress) {
      return;
    }

    form.change('factAddress', regAddress);
  }, [form, addressMatches, regAddress]);

  return (
    <form>
      <Grid container direction="column">
        <Grid item>
          <Grid container spacing={isMobile ? 1 : 4}>
            <PersonBirthInfoFieldset onBlur={() => onBlur?.(values)} />
            <PersonGenderFieldset onBlur={() => onBlur?.(values)} />
          </Grid>
          <Box padding={isMobile ? '1.25rem 0' : '1.625rem 0 1.875rem 0'}>
            <Typography variant="subtitle1">Паспорт</Typography>
          </Box>
          <Box mb={isMobile ? '1.875rem' : '3.75rem'}>
            <Grid container spacing={isMobile ? 1 : 4}>
              <PersonPassportInfoFieldset onBlur={() => onBlur?.(values)} />
            </Grid>
          </Box>
        </Grid>
        <Grid item>
          <Grid container spacing={isMobile ? 1 : 4}>
            <AddressFieldset
              addressMatches={addressMatches}
              loadAddressOptions={loadAddressOptions}
              onBlur={() => onBlur?.(values)}
              isSimpleCredit={isSimpleCredit}
            />
          </Grid>
        </Grid>
      </Grid>
      <Controls approvalPercent={60} onBack={onBack} onSubmit={onSubmit} loading={isLoading} />
    </form>
  );
};

const PassportAddressDataForm: FC<Props> = ({
  initialValues,
  onBack,
  onSubmit,
  isLoading,
  onBlur,
  isSimpleCredit = false,
}) => {
  const validationSchema = Yup.object()
    .shape({})
    .concat(PersonPassportInfoFieldsetSchema())
    .concat(PersonGenderFieldsetSchema)
    .concat(PersonBirthInfoFieldsetSchema())
    .concat(AddressFieldsetSchema(isSimpleCredit));
  const validate = makeValidateSync(validationSchema);
  return (
    <Form validateOnBlur initialValues={initialValues ?? INITIAL_VALUES} onSubmit={onSubmit} validate={validate}>
      {({ handleSubmit, values }) => (
        <FormContent
          onBack={onBack}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onBlur={onBlur}
          values={values}
          isSimpleCredit={isSimpleCredit}
        />
      )}
    </Form>
  );
};

export { PassportAddressDataForm };
