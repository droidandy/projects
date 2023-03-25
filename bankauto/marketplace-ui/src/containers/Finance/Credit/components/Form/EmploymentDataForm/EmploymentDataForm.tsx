import React, { FC, useCallback, useMemo } from 'react';
import { Form, useField, useForm } from 'react-final-form';
import * as Yup from 'yup';

import { getSuggestedAddresses, getSuggestedEmployees } from 'api/dadata';

import { Controls } from 'components/Credit';
import { makeValidateSync } from 'components/Fields/validation';
import { EmploymentFieldset, EmploymentFieldsetSchema } from 'components/Fieldsets';

import { EmploymentData, FormBase } from 'types/CreditFormDataTypes';
import { SelectOption } from 'components/Select/Select';

const useFieldValue = (name: string) => {
  const {
    input: { value },
  } = useField(name, { subscription: { value: true } });
  return value;
};

const INITIAL_VALUES: EmploymentData = {
  employerName: null,
  employerAddress: null,
  employerActivity: '',
  employerPhone: '',
  employmentType: '',
  currentJobExperience: '',
  currentJobPosition: null,
  currentJobCategory: undefined,
  profession: '',
  incomeProofDocumentType: undefined,
  lawyerId: '',
  lawyerRegion: '',
  lawyerLicense: '',
  monthlyIncome: null,
  monthlyOutcome: null,
};

interface Props extends FormBase<EmploymentData> {
  creditAmount: number;
  isLoading: boolean;
  proofDocumentTypeOptionsMap: Record<string, SelectOption[]>;
  isAutoCredit?: boolean;
}

const FormContent: FC<Omit<Props, 'onSubmit'> & { onSubmit: () => void }> = ({
  creditAmount,
  onBack,
  onSubmit,
  isLoading,
  proofDocumentTypeOptionsMap,
  isAutoCredit,
  onBlur,
}) => {
  const form = useForm();
  const employmentType = useFieldValue('employmentType');
  const { values } = form.getState();

  const loadAddressOptions = useCallback(async (query) => {
    const { data } = await getSuggestedAddresses(query);
    return data.map((address) => ({ label: address.value, value: address }));
  }, []);

  const loadEmployeesOptions = useCallback(async (query) => {
    const { data } = await getSuggestedEmployees(query);

    return data.map((employee) => ({ label: employee.value, value: employee, hint: employee.data?.address?.value }));
  }, []);

  return (
    <form>
      <EmploymentFieldset
        employmentType={employmentType}
        creditAmount={creditAmount}
        proofDocumentTypeOptions={proofDocumentTypeOptionsMap[employmentType]}
        showSourceOfAdditionalIncome={isAutoCredit}
        showCurrentJobCategory={isAutoCredit}
        showProfession={isAutoCredit}
        showJobPosition={false}
        loadEmployeesOptions={loadEmployeesOptions}
        loadAddressOptions={loadAddressOptions}
        onBlur={() => onBlur?.(values as EmploymentData)}
      />
      <Controls
        approvalPercent={99}
        submitLabel="Отправить заявку"
        onBack={onBack}
        onSubmit={onSubmit}
        loading={isLoading}
      />
    </form>
  );
};

const EmploymentDataForm: FC<Props> = ({
  creditAmount,
  initialValues,
  onSubmit,
  isLoading,
  isAutoCredit = false,
  proofDocumentTypeOptionsMap,
  onBlur,
}) => {
  const validate = useMemo(() => {
    return makeValidateSync(Yup.object().shape({}).concat(EmploymentFieldsetSchema(creditAmount, isAutoCredit)));
  }, [creditAmount, isAutoCredit]);
  return (
    <Form validateOnBlur initialValues={initialValues ?? INITIAL_VALUES} validate={validate} onSubmit={onSubmit}>
      {({ handleSubmit, values }) => (
        <FormContent
          creditAmount={creditAmount}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onBlur={() => onBlur?.(values)}
          isAutoCredit={isAutoCredit}
          proofDocumentTypeOptionsMap={proofDocumentTypeOptionsMap}
        />
      )}
    </Form>
  );
};

export { EmploymentDataForm };
