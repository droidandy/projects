import React, { FC, useMemo } from 'react';
import InputGroup from '@marketplace/ui-kit/components/InputGroup';
import { useBreakpoints } from '@marketplace/ui-kit';
import { ComponentProps } from 'types/ComponentProps';
import { Input, Select } from 'components/Fields';
import { useField } from 'react-final-form';

interface Props extends ComponentProps {
  name: string;
  index: number;
}

const capitalizeInputValue = (value?: string) => {
  return value && value.replace(/(?:^|\s)./g, (letter) => letter.toUpperCase());
};

const useFieldValue = (name: string) => {
  const {
    input: { value },
  } = useField(name, { subscription: { value: true } });
  return value;
};

const DriverBlock: FC<Props> = ({ name, index }) => {
  const { isMobile } = useBreakpoints();

  const isInsurantDriver = useFieldValue('isInsurantDriver');

  const templateAreas = useMemo(() => {
    return isMobile
      ? [
          ['lastName'],
          ['firstName'],
          ['middleName'],
          ['dateOfBirth'],
          ['sexCode'],
          ['driverLicenseNumber'],
          ['drivingExperienceDateStart'],
        ]
      : [
          ['lastName', 'firstName', 'middleName'],
          ['dateOfBirth', 'sexCode', 'driverLicenseNumber'],
          ['drivingExperienceDateStart', '.', '.'],
        ];
  }, [isMobile]);

  const SEX_CODES = [
    { label: 'Мужчина', value: 'M' },
    { label: 'Женщина', value: 'F' },
  ];

  return (
    <InputGroup templateAreas={templateAreas}>
      <Input
        variant="outlined"
        key="lastName"
        area="lastName"
        placeholder="Фамилия"
        name={`${name}.lastName`}
        format={capitalizeInputValue}
        disabled={isInsurantDriver && index === 0}
      />
      <Input
        variant="outlined"
        key="firstName"
        area="firstName"
        placeholder="Имя"
        name={`${name}.firstName`}
        format={capitalizeInputValue}
        disabled={isInsurantDriver && index === 0}
      />
      <Input
        variant="outlined"
        key="middleName"
        area="middleName"
        placeholder="Отчество"
        name={`${name}.middleName`}
        format={capitalizeInputValue}
        disabled={isInsurantDriver && index === 0}
      />
      <Select area="sexCode" placeholder="Пол" name={`${name}.sexCode`} options={SEX_CODES} />
      <Input
        variant="outlined"
        useFormattedValue
        mask="##.##.####"
        key="dateOfBirth"
        area="dateOfBirth"
        placeholder="Дата рождения"
        name={`${name}.dateOfBirth`}
        disabled={isInsurantDriver && index === 0}
      />
      <Input
        variant="outlined"
        useFormattedValue
        mask="#### ######"
        key="driverLicenseNumber"
        area="driverLicenseNumber"
        placeholder="Серия и номер ВУ"
        name={`${name}.driverLicenseNumber`}
      />
      <Input
        variant="outlined"
        useFormattedValue
        mask="##.##.####"
        key="drivingExperienceDateStart"
        area="drivingExperienceDateStart"
        placeholder="Дата выдачи ВУ"
        name={`${name}.drivingExperienceDateStart`}
      />
    </InputGroup>
  );
};

export default DriverBlock;
