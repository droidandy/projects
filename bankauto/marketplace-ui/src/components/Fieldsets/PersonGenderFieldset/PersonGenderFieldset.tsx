import React, { FC } from 'react';
import { Grid } from '@marketplace/ui-kit';
import { SelectNew as Select } from 'components/Fields';
import { WithOnBlur } from 'types/WithOnBlur';
import { GENDER_OPTIONS } from './data';

interface Props extends WithOnBlur<any> {}

const PersonGenderFieldset: FC<Props> = ({ onBlur }) => {
  return (
    <Grid item xs={12} sm={4}>
      <Select name="gender" placeholder="Пол" variant="outlined" options={GENDER_OPTIONS} onBlur={onBlur} />
    </Grid>
  );
};

export { PersonGenderFieldset };
