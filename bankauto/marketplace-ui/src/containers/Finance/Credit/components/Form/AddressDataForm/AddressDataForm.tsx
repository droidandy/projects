import React, { FC, useCallback, useEffect } from 'react';
import { Form, useField, useForm } from 'react-final-form';
import * as Yup from 'yup';

import { getSuggestedAddresses } from 'api/dadata';

import { Controls } from 'components/Credit';
import { makeValidateSync } from 'components/Fields/validation';
import { AddressFieldset, AddressFieldsetSchema } from 'components/Fieldsets';
import { AddressData, FormBase } from 'types/CreditFormDataTypes';

const useFieldValue = (name: string) => {
  const {
    input: { value },
  } = useField(name, { subscription: { value: true } });
  return value;
};

const INITIAL_VALUES: AddressData = {
  regAddress: null,
  factAddress: null,
  addressMatches: false,
};

interface Props extends FormBase<AddressData> {
  isLoading: boolean;
  isSimpleCredit?: boolean;
}

const FormContent: FC<Omit<Props, 'onSubmit'> & { onSubmit: () => void }> = ({
  onBack,
  onSubmit,
  isLoading,
  onBlur,
  isSimpleCredit,
}) => {
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
      <AddressFieldset
        addressMatches={addressMatches}
        loadAddressOptions={loadAddressOptions}
        onBlur={onBlur}
        isSimpleCredit={isSimpleCredit}
      />
      <Controls approvalPercent={60} onBack={onBack} onSubmit={onSubmit} loading={isLoading} />
    </form>
  );
};

const AddressDataForm: FC<Props> = ({ initialValues, onBack, onSubmit, isLoading, onBlur, isSimpleCredit = false }) => {
  const validationSchema = Yup.object().shape({}).concat(AddressFieldsetSchema(isSimpleCredit));
  const validate = makeValidateSync(validationSchema);
  return (
    <Form initialValues={initialValues ?? INITIAL_VALUES} validate={validate} onSubmit={onSubmit}>
      {({ handleSubmit, values }) => (
        <FormContent
          onBack={onBack}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          onBlur={() => onBlur?.(values)}
          isSimpleCredit={isSimpleCredit}
        />
      )}
    </Form>
  );
};

export { AddressDataForm };
