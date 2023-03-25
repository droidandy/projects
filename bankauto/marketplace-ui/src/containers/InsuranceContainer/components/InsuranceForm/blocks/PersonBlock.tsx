import React, { FC, useCallback, useMemo } from 'react';
import InputGroup from '@marketplace/ui-kit/components/InputGroup';
import { ComponentProps } from 'types/ComponentProps';
import { useBreakpoints } from '@marketplace/ui-kit';
import { AsyncAutocomplete, Input } from 'components/Fields';
import { getSuggestedAddresses } from '../../../../../api';
import { Address } from '../../../../../types/Address';
import { useFieldValue } from '../../../../../components/Fields/helpers';
import { INSURANCE_FORM_TYPE } from '../../../../../types/Insurance';

interface Props extends ComponentProps {
  hideInitials: boolean;
  prefix: string;
}

const addressMapper = (dto: any): Address => ({
  country: dto.country,
  region: dto.region,
  city: dto.city,
  district: dto.federal_district,
  settlement: dto.settlement,
  street: dto.street,
  house: dto.house,
  building: dto.block,
  zipCode: dto.postal_code,
  kladrId: dto.kladr_id,
});

const capitalizeInputValue = (value: string) => {
  return value.replace(/(?:^|\s)./g, (letter) => letter.toUpperCase());
};

const PersonForm: FC<Props> = ({ hideInitials, prefix }) => {
  const { isMobile } = useBreakpoints();
  const formType = useFieldValue('formType');
  const nameAreas = useMemo(() => {
    return hideInitials ? [] : [['lastName'], ['firstName'], ['middleName']];
  }, [hideInitials]);

  const templateAreas = useMemo(() => {
    const adaptedNameAreas = isMobile ? nameAreas : [nameAreas.flat()];
    const requiredAreas = isMobile
      ? ([
          ['dateOfBirth'],
          ['passportNumber'],
          ['passportIssuedAt'],
          formType !== INSURANCE_FORM_TYPE.CASCO ? ['passportIssuer'] : null,
          ['registration'],
        ].filter((area) => Array.isArray(area)) as string[][])
      : ([
          ['dateOfBirth', 'passportNumber', 'passportIssuedAt'],
          formType !== INSURANCE_FORM_TYPE.CASCO ? ['passportIssuer', 'passportIssuer', 'passportIssuer'] : null,
          ['registration', 'registration', 'registration'],
        ].filter((area) => Array.isArray(area)) as string[][]);
    return nameAreas.length ? [...adaptedNameAreas, ...requiredAreas] : requiredAreas;
  }, [nameAreas, isMobile, formType]);

  const loadAddressOptions = useCallback((query) => {
    return getSuggestedAddresses(query).then(({ data }) => {
      return data.map((address) => ({ label: address.value, value: addressMapper(address.data) }));
    });
  }, []);

  return (
    <InputGroup templateAreas={templateAreas}>
      {!hideInitials ? (
        <Input
          variant="outlined"
          area="lastName"
          placeholder="Фамилия"
          name={`${prefix}.lastName`}
          parse={capitalizeInputValue}
        />
      ) : null}
      {!hideInitials ? (
        <Input
          variant="outlined"
          area="firstName"
          placeholder="Имя"
          name={`${prefix}.firstName`}
          parse={capitalizeInputValue}
        />
      ) : null}
      {!hideInitials ? (
        <Input
          variant="outlined"
          area="middleName"
          placeholder="Отчество"
          name={`${prefix}.middleName`}
          parse={capitalizeInputValue}
        />
      ) : null}
      <Input
        variant="outlined"
        area="dateOfBirth"
        placeholder="Дата рождения"
        name={`${prefix}.dateOfBirth`}
        mask="##.##.####"
        useFormattedValue
      />
      <Input
        variant="outlined"
        area="passportNumber"
        placeholder="Серия и номер паспорта"
        name={`${prefix}.passportNumber`}
        mask="#### ######"
        useFormattedValue
      />
      {formType !== INSURANCE_FORM_TYPE.CASCO ? (
        <Input variant="outlined" area="passportIssuer" placeholder="Кем выдан" name={`${prefix}.passportIssuer`} />
      ) : null}
      <Input
        variant="outlined"
        area="passportIssuedAt"
        placeholder="Дата выдачи"
        name={`${prefix}.passportIssuedAt`}
        mask="##.##.####"
        useFormattedValue
      />
      <AsyncAutocomplete
        loadOptions={loadAddressOptions}
        name={`${prefix}.registration`}
        area="registration"
        placeholder="Адрес регистрации"
        filterOptions={(o: any) => o}
      />
    </InputGroup>
  );
};

export default PersonForm;
