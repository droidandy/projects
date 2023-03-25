import React, { FC } from 'react';
import { Form } from 'react-final-form';
import * as Yup from 'yup';
import { Grid, useBreakpoints } from '@marketplace/ui-kit';
import { Controls } from 'components/Credit';
import { SelectOption } from 'components/Select/Select';
import { makeValidateSync } from 'components/Fields/validation';
import { PersonPersonalInfoFieldset, PersonPersonalInfoFieldsetSchema } from 'components/Fieldsets';
import { FormBase, PersonalData } from 'types/CreditFormDataTypes';
import { CreditPurpose } from 'types/CreditPurpose';
import { AcceptTerms, AcceptTermsSchema } from '../AcceptTerms';

const INITIAL_VALUES: PersonalData & { acceptTerms: boolean } = {
  lastName: '',
  firstName: '',
  patronymic: '',
  phone: '',
  email: '',
  acceptTerms: false,
  creditPurpose: undefined,
};

interface Props extends FormBase<PersonalData> {
  isLoading?: boolean;
  phone?: string;
  setCreditPurpose?: React.Dispatch<React.SetStateAction<CreditPurpose>>;
}

const PersonalDataForm: FC<Props> = ({ initialValues, onSubmit, isLoading, phone, onBlur, setCreditPurpose }) => {
  const validationSchema = Yup.object()
    .shape({})
    .concat(PersonPersonalInfoFieldsetSchema(!phone))
    .concat(AcceptTermsSchema);
  const validate = makeValidateSync(validationSchema);
  const { isMobile } = useBreakpoints();
  const CREDIT_PURPOSE_OPTIONS: SelectOption<CreditPurpose>[] = [
    { label: 'Кредит наличными', value: CreditPurpose.OTHER_CONSUMER_NEEDS },
    { label: 'Кредит на автомобиль', value: CreditPurpose.BUYING_VEHICLE },
  ];

  return (
    <Form initialValues={initialValues ?? INITIAL_VALUES} subscription={{}} validate={validate} onSubmit={onSubmit}>
      {({ handleSubmit, values }) => (
        <form>
          <Grid container direction="column">
            <Grid item>
              <Grid container spacing={isMobile ? 1 : 4}>
                <PersonPersonalInfoFieldset
                  phone={phone}
                  disabled={!!phone}
                  onBlur={() => onBlur?.(values)}
                  creditPurposeOptions={setCreditPurpose ? CREDIT_PURPOSE_OPTIONS : undefined}
                  creditPurposeOnChange={setCreditPurpose}
                />
              </Grid>
            </Grid>
          </Grid>
          <Controls approvalPercent={20} onSubmit={handleSubmit} leftChild={<AcceptTerms />} loading={isLoading} />
        </form>
      )}
    </Form>
  );
};

export { PersonalDataForm };
