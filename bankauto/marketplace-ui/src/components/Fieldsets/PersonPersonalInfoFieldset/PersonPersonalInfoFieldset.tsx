import React, { FC } from 'react';
import { Grid, PHONE_INPUT_FORMAT } from '@marketplace/ui-kit';
import { Input, SelectNew as Select } from 'components/Fields';
import { SelectOption } from 'components/Select/Select';
import { capitalizeInputValueWC } from 'helpers/capitalizeInputValue';
import { withoutCode } from 'helpers';
import { WithOnBlur } from 'types/WithOnBlur';

interface Props extends WithOnBlur<any> {
  phone?: string;
  disabled?: boolean;
  creditPurposeOptions?: SelectOption[];
  creditPurposeOnChange?: (value: number) => void;
}

const PersonPersonalInfoFieldset: FC<Props> = ({
  phone,
  disabled,
  onBlur,
  creditPurposeOptions,
  creditPurposeOnChange,
}) => {
  return (
    <>
      <Grid item xs={12} sm={4}>
        <Input
          name="lastName"
          placeholder="Фамилия"
          variant="outlined"
          parse={capitalizeInputValueWC}
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Input name="firstName" placeholder="Имя" variant="outlined" parse={capitalizeInputValueWC} onBlur={onBlur} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Input
          name="patronymic"
          placeholder="Отчество"
          variant="outlined"
          parse={capitalizeInputValueWC}
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Input
          name="phone"
          variant="outlined"
          placeholder="Мобильный телефон"
          mask={PHONE_INPUT_FORMAT}
          value={phone ? withoutCode(phone) : undefined}
          disabled={disabled}
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Input name="email" placeholder="Email" variant="outlined" onBlur={onBlur} />
      </Grid>
      {creditPurposeOptions && (
        <Grid item xs={12} sm={4}>
          <Select
            name="creditPurpose"
            placeholder="Цель кредита"
            variant="outlined"
            options={creditPurposeOptions}
            onBlur={onBlur}
            onChange={(value: number) => creditPurposeOnChange?.(value)}
          />
        </Grid>
      )}
    </>
  );
};

export { PersonPersonalInfoFieldset };
