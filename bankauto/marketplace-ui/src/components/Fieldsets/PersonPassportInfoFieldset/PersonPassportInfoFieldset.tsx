import React, { FC } from 'react';
import { Grid } from '@marketplace/ui-kit';

import { Input } from 'components/Fields';
import { WithOnBlur } from 'types/WithOnBlur';

interface Props extends WithOnBlur<any> {}

const PersonPassportInfoFieldset: FC<Props> = ({ onBlur }) => {
  return (
    <>
      <Grid item xs={12} sm={4}>
        <Input name="passport" placeholder="Серия и номер" variant="outlined" mask="#### ######" onBlur={onBlur} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Input
          useFormattedValue
          name="passportIssuedAt"
          placeholder="Дата выдачи"
          variant="outlined"
          mask="##.##.####"
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Input
          useFormattedValue
          name="passportIssuerCode"
          placeholder="Код подразделения"
          variant="outlined"
          mask="###-###"
          onBlur={onBlur}
        />
      </Grid>
      <Grid item xs={12}>
        <Input name="passportIssuer" placeholder="Кем выдан (как в паспорте)" variant="outlined" onBlur={onBlur} />
      </Grid>
    </>
  );
};

export { PersonPassportInfoFieldset };
