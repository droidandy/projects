import React, { FC } from 'react';
import { Form } from 'react-final-form';
import * as Yup from 'yup';
import { Grid, Box, Typography, useBreakpoints, PHONE_INPUT_FORMAT } from '@marketplace/ui-kit';
import { makeValidateSync } from 'components/Fields/validation';
import {
  PersonAdditionalInfoFieldset,
  PersonAdditionalInfoFieldsetSchema,
  ContactPersonFieldset,
  ContactPersonFieldsetSchema,
} from 'components/Fieldsets';
import { withoutCode } from 'helpers';
import { Controls } from 'components/Credit';
import { Input } from 'components/Fields';
import { AdditionalData, FormBase } from 'types/CreditFormDataTypes';
import { AdditionalDocumentType } from 'constants/credit';

const INITIAL_VALUES: AdditionalData = {
  educationType: '',
  maritalStatus: '',
  numberOfDependants: 0,
  contactPersonsLastName: '',
  contactPersonsFirstName: '',
  contactPersonsPatronymic: '',
  contactPersonsType: '',
  contactPersonsPhone: '',
  additionalDocumentType: '',
};

const ADDITIONAL_DOCUMENT_TYPES = [
  { label: 'Водительское удостоверение', value: AdditionalDocumentType.DRIVERS_LICENSE },
  { label: 'Заграничный паспорт', value: AdditionalDocumentType.INTERNATIONAL_PASSPORT },
  { label: 'Служебное удостоверение (МВД, ФСБ и т.п.)', value: AdditionalDocumentType.SERVICE_IDENTITY },
  { label: 'Военный билет', value: AdditionalDocumentType.MILITARY_ID },
];

const SHORT_ADDITIONAL_DOCUMENT_TYPES = [
  { label: 'Водительское удостоверение', value: AdditionalDocumentType.DRIVERS_LICENSE },
  { label: 'Заграничный паспорт', value: AdditionalDocumentType.INTERNATIONAL_PASSPORT },
  { label: 'Служебное удостоверение (МВД, ФСБ и т.п.)', value: AdditionalDocumentType.SERVICE_IDENTITY },
  { label: 'Без дополнительного документа', value: '5' },
];

interface Props extends FormBase<AdditionalData> {
  userPhone: string;
  isLoading: boolean;
  isSimpleCredit?: boolean;
}

const AdditionalDataForm: FC<Props> = ({ initialValues, onSubmit, isLoading, onBlur, isSimpleCredit, userPhone }) => {
  const { isMobile } = useBreakpoints();
  let validationSchema;
  if (!isSimpleCredit) {
    validationSchema = Yup.object()
      .shape({})
      .concat(PersonAdditionalInfoFieldsetSchema())
      .concat(ContactPersonFieldsetSchema(userPhone));
  } else {
    validationSchema = Yup.object()
      .shape({})
      .concat(PersonAdditionalInfoFieldsetSchema())
      .concat(
        Yup.object().shape({
          additionalPhone: Yup.string()
            .required('Необходимо указать дополнительный телефон')
            .length(10, 'Телефон состоит из 10 цифр')
            .test('similarNumbers', 'Совпадает с телефоном заемщика', (value) =>
              !userPhone ? true : withoutCode(userPhone) !== value,
            ),
        }),
      );
  }
  const validate = makeValidateSync(validationSchema);
  return (
    <Form validateOnBlur initialValues={initialValues ?? INITIAL_VALUES} validate={validate} onSubmit={onSubmit}>
      {({ handleSubmit, values }) => {
        return (
          <form>
            <Grid container direction="column">
              <PersonAdditionalInfoFieldset
                onBlur={() => onBlur?.(values)}
                additionalDocumentOptions={isSimpleCredit ? SHORT_ADDITIONAL_DOCUMENT_TYPES : ADDITIONAL_DOCUMENT_TYPES}
                isSimpleCredit={isSimpleCredit}
              />
              {!isSimpleCredit && (
                <Grid item xs>
                  <Box padding={isMobile ? '1.25rem 0' : '1.625rem 0 1.875rem 0'}>
                    <Typography variant="subtitle1">Контактное лицо</Typography>
                  </Box>
                  <ContactPersonFieldset onBlur={() => onBlur?.(values)} />
                </Grid>
              )}
            </Grid>
            {isSimpleCredit && (
              <Box paddingTop={isMobile ? '0.5rem' : '2rem'}>
                <Grid container direction="column" spacing={isMobile ? 1 : 4}>
                  <Grid item xs={12} sm={4}>
                    <Input
                      name="additionalPhone"
                      placeholder="Дополнительный телефон"
                      variant="outlined"
                      mask={PHONE_INPUT_FORMAT}
                      onBlur={onBlur}
                    />
                  </Grid>
                </Grid>
              </Box>
            )}
            <Controls approvalPercent={80} onSubmit={handleSubmit} loading={isLoading} />
          </form>
        );
      }}
    </Form>
  );
};

export { AdditionalDataForm };
