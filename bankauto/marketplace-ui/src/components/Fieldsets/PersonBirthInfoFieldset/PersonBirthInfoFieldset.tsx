import React, { FC } from 'react';
import { Grid } from '@marketplace/ui-kit';
import { Input } from 'components/Fields';
import { WithOnBlur } from 'types/WithOnBlur';

interface Props extends WithOnBlur<any> {}

const PersonBirthInfoFieldset: FC<Props> = ({ onBlur }) => {
  return (
    <>
      <Grid item xs={12}>
        <Input name="birthPlace" placeholder="Место рождения" variant="outlined" onBlur={onBlur} />
      </Grid>
      <Grid item xs={12} sm={4}>
        <Input
          useFormattedValue
          name="birthDate"
          placeholder="Дата рождения"
          variant="outlined"
          mask="##.##.####"
          onBlur={onBlur}
        />
      </Grid>
    </>
  );
};

export { PersonBirthInfoFieldset };
