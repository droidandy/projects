import React, { FC } from 'react';
import InputGroup from '@marketplace/ui-kit/components/InputGroup';
import { FilterButtonSubmit } from 'components/FilterButton';
import { SelectBase } from 'components/Fields/SelectBase';

import { useStyles } from './Filter.styles';

const DESKTOP_FIELDS = [['city', 'brand', 'model', 'year']];

export const FilterDesktop: FC = () => {
  const s = useStyles();
  return (
    <>
      <InputGroup className={s.desktopGroup} templateAreas={DESKTOP_FIELDS}>
        <SelectBase className={s.control} name="city" area="city" placeholder="Город" variant="outlined" show />
        <SelectBase className={s.control} name="brand" area="brand" placeholder="Марка" variant="outlined" show />
        <SelectBase className={s.control} name="model" area="model" placeholder="Модель" variant="outlined" show />
        <SelectBase className={s.control} name="year" area="year" placeholder="Год выпуска" variant="outlined" show />
      </InputGroup>
      <FilterButtonSubmit />
    </>
  );
};
