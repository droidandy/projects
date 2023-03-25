import React, { FC } from 'react';
import { Form } from 'react-final-form';
import * as Yup from 'yup';

import { Grid, Box, useBreakpoints } from '@marketplace/ui-kit';

import { makeValidateSync } from 'components/Fields/validation';
import { PersonPersonalInfoFieldset, PersonPersonalInfoFieldsetSchema } from 'components/Fieldsets';
import { FormBase, PersonalData } from 'types/CreditFormDataTypes';

import { Controls } from 'components/Credit';
import { AcceptTerms, AcceptTermsSchema } from '../AcceptTerms';

const INITIAL_VALUES: PersonalData & { acceptTerms: boolean } = {
  lastName: '',
  firstName: '',
  patronymic: '',
  phone: '',
  email: '',
  acceptTerms: false,
};

interface Props extends FormBase<PersonalData> {
  isLoading?: boolean;
  phone?: string;
}

const PersonalDataForm: FC<Props> = ({ initialValues, onSubmit, isLoading, phone }) => {
  const { isMobile } = useBreakpoints();
  const validationSchema = Yup.object()
    .shape({})
    .concat(PersonPersonalInfoFieldsetSchema(!phone))
    .concat(AcceptTermsSchema);
  const validate = makeValidateSync(validationSchema);

  return (
    <Form initialValues={initialValues ?? INITIAL_VALUES} subscription={{}} validate={validate} onSubmit={onSubmit}>
      {({ handleSubmit }) => (
        <form>
          <Grid container spacing={isMobile ? 1 : 4}>
            <PersonPersonalInfoFieldset phone={phone} disabled={!!phone} />
          </Grid>
          <Controls
            approvalPercent={20}
            onSubmit={handleSubmit}
            submitLabel="Отправить"
            leftChild={<AcceptTerms />}
            loading={isLoading}
            hideProbabilityApproval
          />
        </form>
      )}
    </Form>
  );
};

export { PersonalDataForm };
