import React, { FC } from 'react';
import { Grid, PHONE_INPUT_FORMAT, useBreakpoints } from '@marketplace/ui-kit';

import { Input, SelectNew as Select } from 'components/Fields';
import { capitalizeInputValueWC } from 'helpers/capitalizeInputValue';
import { WithOnBlur } from 'types/WithOnBlur';
import { ContactPersonData } from 'types/CreditFormDataTypes';
import { CONTACT_PERSONS_TYPES } from './data';

interface Props extends WithOnBlur<ContactPersonData> {}

const ContactPersonFieldset: FC<Props> = ({ onBlur }) => {
  const { isMobile } = useBreakpoints();

  return (
    <Grid container spacing={isMobile ? 1 : 4}>
      <Grid item xs={12} sm={4}>
        <Input
          name="contactPersonsLastName"
          placeholder="Фамилия"
          variant="outlined"
          parse={capitalizeInputValueWC}
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Input
          name="contactPersonsFirstName"
          placeholder="Имя"
          variant="outlined"
          parse={capitalizeInputValueWC}
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Input
          name="contactPersonsPatronymic"
          placeholder="Отчество"
          variant="outlined"
          parse={capitalizeInputValueWC}
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Select
          name="contactPersonsType"
          placeholder="Кем приходится"
          variant="outlined"
          options={CONTACT_PERSONS_TYPES}
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Input
          name="contactPersonsPhone"
          placeholder="Номер телефона"
          variant="outlined"
          mask={PHONE_INPUT_FORMAT}
          onBlur={onBlur}
        />
      </Grid>
    </Grid>
  );
};

export { ContactPersonFieldset };
