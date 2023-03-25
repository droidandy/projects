import React, { FC } from 'react';
import { Box, Grid, PHONE_INPUT_FORMAT, useBreakpoints } from '@marketplace/ui-kit';

import {
  AsyncAutocompleteNew as AsyncAutocomplete,
  AutocompleteNew as Autocomplete,
  Input,
  InputPrice,
  SelectNew as Select,
} from 'components/Fields';
import {
  PROOF_CREDIT_SUM,
  currentJobCategoryOptions,
  currentJobExperienceOptions,
  EmploymentType,
  employmentTypeOptions,
  organisationActivityOptions,
  professionOptions,
  additionalIncomeTypeOptions,
} from 'constants/creditEmployment';
import { AutocompleteOption } from 'components/Autocomplete';
import { SelectOption } from 'components/Select/Select';
import { EmploymentData } from 'types/CreditFormDataTypes';
import { WithOnBlur } from 'types/WithOnBlur';
import positions from '../data/positions.json';

interface Props extends WithOnBlur<EmploymentData> {
  employmentType: EmploymentType;
  creditAmount: number;
  proofDocumentTypeOptions: SelectOption[];
  showSourceOfAdditionalIncome?: boolean;
  showCurrentJobCategory?: boolean;
  showProfession?: boolean;
  showJobPosition?: boolean;
  outcomePlaceholder?: string;
  loadEmployeesOptions: (query: string) => Promise<AutocompleteOption[]>;
  loadAddressOptions: (query: string) => Promise<AutocompleteOption[]>;
}

const EmploymentFieldset: FC<Props> = ({
  employmentType,
  creditAmount,
  proofDocumentTypeOptions = [],
  showSourceOfAdditionalIncome = false,
  showCurrentJobCategory = true,
  showProfession = true,
  showJobPosition = true,
  outcomePlaceholder = 'Расходы в месяц, ₽',
  loadEmployeesOptions,
  loadAddressOptions,
  onBlur,
}) => {
  const { isMobile } = useBreakpoints();

  return (
    <Grid container direction="column">
      <Box mb={isMobile ? '1.875rem' : '3.75rem'}>
        <Grid item xs>
          <Grid container spacing={isMobile ? 1 : 4}>
            <Grid item xs={12}>
              <Select
                name="employmentType"
                placeholder="Тип занятости"
                variant="outlined"
                options={employmentTypeOptions}
                onBlur={onBlur}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {employmentType && (
        <>
          {employmentType !== EmploymentType.PENSIONER && (
            <>
              <Box mb={isMobile ? '1.875rem' : '3.75rem'}>
                <Grid item xs>
                  <Grid container spacing={isMobile ? 1 : 4}>
                    {![EmploymentType.LAWYER, EmploymentType.NOTARY].includes(employmentType) && (
                      <Grid item xs={12}>
                        <AsyncAutocomplete
                          placeholder={`${
                            [EmploymentType.ENTREPRENEUR, EmploymentType.BUSINESS].includes(employmentType)
                              ? 'Название юр. лица'
                              : 'Название организации работодателя'
                          }`}
                          name="employerName"
                          variant="outlined"
                          loadOptions={loadEmployeesOptions}
                          filterOptions={(options: any) => options}
                          onBlur={onBlur}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={employmentType === EmploymentType.MILITARY ? 8 : 12}>
                      <AsyncAutocomplete
                        name="employerAddress"
                        placeholder={`Фактический адрес${
                          employmentType === EmploymentType.WAGE ? ' работодателя' : ''
                        }`}
                        variant="outlined"
                        loadOptions={loadAddressOptions}
                        filterOptions={(options: any) => options}
                        onBlur={onBlur}
                      />
                    </Grid>
                    {employmentType === EmploymentType.LAWYER && (
                      <>
                        <Grid item xs={12} sm={4}>
                          <Input name="lawyerId" placeholder="Реестровый номер" variant="outlined" onBlur={onBlur} />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Input
                            name="lawyerRegion"
                            placeholder="Регион регистрации адвоката"
                            variant="outlined"
                            onBlur={onBlur}
                          />
                        </Grid>
                      </>
                    )}
                    {employmentType === EmploymentType.NOTARY && (
                      <Grid item xs={12} sm={8}>
                        <Input name="lawyerLicense" placeholder="Лицензия" variant="outlined" onBlur={onBlur} />
                      </Grid>
                    )}
                    {![EmploymentType.MILITARY, EmploymentType.LAWYER, EmploymentType.NOTARY].includes(
                      employmentType,
                    ) && (
                      <Grid item xs={12} sm={8}>
                        <Select
                          name="employerActivity"
                          placeholder="Вид деятельности организации"
                          variant="outlined"
                          options={organisationActivityOptions}
                          onBlur={onBlur}
                        />
                      </Grid>
                    )}
                    <Grid item xs={12} sm={4}>
                      <Input
                        name="employerPhone"
                        placeholder={
                          employmentType === EmploymentType.WAGE
                            ? 'Номер телефона работодателя'
                            : 'Официальный номер телефона'
                        }
                        variant="outlined"
                        mask={PHONE_INPUT_FORMAT}
                        onBlur={onBlur}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Box mb={isMobile ? '1.875rem' : '3.75rem'}>
                <Grid item xs>
                  <Grid container spacing={isMobile ? 1 : 4}>
                    <Grid item xs={12} sm={4}>
                      <Select
                        name="currentJobExperience"
                        placeholder="Стаж на текущем месте"
                        variant="outlined"
                        options={currentJobExperienceOptions}
                        onBlur={onBlur}
                      />
                    </Grid>
                    {showJobPosition && [EmploymentType.WAGE, EmploymentType.BUSINESS].includes(employmentType) && (
                      <Grid item xs={12} sm={4}>
                        <Autocomplete
                          placeholder="Должность"
                          name="currentJobPosition"
                          variant="outlined"
                          options={positions}
                          onBlur={onBlur}
                        />
                      </Grid>
                    )}
                    {showCurrentJobCategory && employmentType === EmploymentType.WAGE && (
                      <Grid item xs={12} sm={4}>
                        <Select
                          name="currentJobCategory"
                          placeholder="Категория должности"
                          variant="outlined"
                          options={currentJobCategoryOptions}
                          onBlur={onBlur}
                        />
                      </Grid>
                    )}
                    {showProfession && [EmploymentType.WAGE, EmploymentType.BUSINESS].includes(employmentType) && (
                      <Grid item xs={12} sm={4}>
                        <Select
                          name="profession"
                          placeholder="Профессия"
                          variant="outlined"
                          options={professionOptions}
                          onBlur={onBlur}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Box>
            </>
          )}
          <Grid item xs>
            <Grid container spacing={isMobile ? 1 : 4}>
              <Grid item xs={12} sm={4}>
                <InputPrice name="monthlyIncome" variant="outlined" placeholder="Доход в месяц, ₽" onBlur={onBlur} />
              </Grid>
              {creditAmount >= PROOF_CREDIT_SUM && (
                <Grid item xs={12} sm={4}>
                  <Select
                    name="incomeProofDocumentType"
                    placeholder="Тип подтверждающего документа"
                    variant="outlined"
                    options={proofDocumentTypeOptions}
                    onBlur={onBlur}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={4}>
                <InputPrice
                  variant="outlined"
                  placeholder="Доп. доход в месяц, ₽"
                  name="additionalIncome"
                  onBlur={onBlur}
                />
              </Grid>
              {showSourceOfAdditionalIncome && (
                <Grid item xs={12} sm={4}>
                  <Select
                    name="additionalIncomeType"
                    placeholder="Источник доп. дохода"
                    variant="outlined"
                    options={additionalIncomeTypeOptions}
                    onBlur={onBlur}
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={4}>
                <InputPrice variant="outlined" placeholder={outcomePlaceholder} name="monthlyOutcome" onBlur={onBlur} />
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};

export { EmploymentFieldset };
