import React, { FC } from 'react';
import { Box, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { InfoTooltip } from 'components';
import { Input, InputMasked, InputNumber, SelectNew as Select } from 'components/Fields';
import { WithOnBlur } from 'types/WithOnBlur';
import { PersonAdditionalInfoData } from 'types/CreditFormDataTypes';
import { SelectOption } from 'components/Select/Select';
import { AdditionalDocumentType } from 'constants/credit';
import { uppercaseInputValueWC } from 'helpers';
import {
  DEPENDANTS_RESTRICTION_TEXT,
  EDUCATION_TYPES,
  MARITAL_STATUSES,
  MAX_NUMBER_OF_DEPENDANTS,
  SHORT_EDUCATION_TYPES,
} from './data';

const parseNumberOfDependants = (value: number) => {
  if (value < 0) return 0;
  if (value > 9) return 9;
  return Math.floor(value);
};

const ADDITIONAL_DOCUMENT_TYPE_MASK_MAP: Record<string, string> = {
  [AdditionalDocumentType.INTERNATIONAL_PASSPORT]: '99 9999999',
  [AdditionalDocumentType.SNILS]: '999-999-999 99',
  [AdditionalDocumentType.DRIVERS_LICENSE]: '99 [9Яя][9Яя] 999999',
};

interface Props extends WithOnBlur<PersonAdditionalInfoData> {
  additionalDocumentOptions: SelectOption[];
  additionalDocumentType?: AdditionalDocumentType;
  hasAddiionalDocumentMetaFields?: boolean;
  isSimpleCredit?: boolean;
}

const PersonAdditionalInfoFieldset: FC<Props> = ({
  additionalDocumentOptions,
  additionalDocumentType,
  hasAddiionalDocumentMetaFields,
  isSimpleCredit = false,
  onBlur,
}) => {
  const { isMobile } = useBreakpoints();

  return (
    <Grid item xs>
      <Grid container spacing={isMobile ? 1 : 4}>
        <Grid item xs={12} sm={4}>
          <Select
            name="educationType"
            placeholder="Образование"
            variant="outlined"
            options={isSimpleCredit ? SHORT_EDUCATION_TYPES : EDUCATION_TYPES}
            onBlur={onBlur}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Select
            name="maritalStatus"
            placeholder="Семейный статус"
            variant="outlined"
            options={MARITAL_STATUSES}
            onBlur={onBlur}
          />
        </Grid>
        {!isSimpleCredit && (
          <Grid item xs={12} sm={4}>
            <InputNumber
              name="numberOfDependants"
              variant="outlined"
              type="number"
              placeholder="Кол-во лиц на иждивении"
              endAdornment={
                <InfoTooltip
                  title={
                    <Box color="primary.contrastText">
                      <Typography variant="body2" color="inherit">
                        {DEPENDANTS_RESTRICTION_TEXT}
                      </Typography>
                    </Box>
                  }
                />
              }
              max={MAX_NUMBER_OF_DEPENDANTS}
              min={0}
              parse={parseNumberOfDependants}
              onBlur={onBlur}
            />
          </Grid>
        )}
        <Grid item xs={12} sm={4}>
          <Select
            name="additionalDocumentType"
            placeholder="Дополнительный документ"
            variant="outlined"
            options={additionalDocumentOptions}
            onBlur={onBlur}
          />
        </Grid>
        {additionalDocumentType && hasAddiionalDocumentMetaFields && (
          <>
            <Grid item xs={12} sm={4}>
              {ADDITIONAL_DOCUMENT_TYPE_MASK_MAP[additionalDocumentType] ? (
                <InputMasked
                  format={uppercaseInputValueWC}
                  mask={ADDITIONAL_DOCUMENT_TYPE_MASK_MAP[additionalDocumentType]}
                  name="additionalDocumentFullName"
                  placeholder="Серия и номер"
                  variant="outlined"
                  onBlur={onBlur}
                />
              ) : (
                <Input
                  name="additionalDocumentFullName"
                  placeholder="Серия и номер"
                  variant="outlined"
                  onBlur={onBlur}
                />
              )}
            </Grid>
            {additionalDocumentType !== AdditionalDocumentType.SNILS && (
              <Grid item xs={12} sm={4}>
                <Input
                  useFormattedValue
                  mask="##.##.####"
                  name="additionalDocumentIssuedAt"
                  placeholder="Дата выдачи"
                  variant="outlined"
                  disabled={!additionalDocumentType}
                  onBlur={onBlur}
                />
              </Grid>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export { PersonAdditionalInfoFieldset };
