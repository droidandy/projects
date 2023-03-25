import React, { useEffect, useState } from 'react';
import { CatalogModel } from '@marketplace/ui-kit/types';
import Autocomplete, { AutocompleteOption, AutocompleteProps } from '@marketplace/ui-kit/components/Autocomplete';
import inRange from 'lodash/inRange';

interface Props extends Omit<AutocompleteProps<false>, 'multiple' | 'value' | 'options'> {
  modelData?: CatalogModel;
  value?: AutocompleteOption | null;
  handleClear?: () => void;
  disabled?: boolean;
}

const mapProductionYear = (i: number): AutocompleteOption => ({ label: `${i}`, value: i });

const SelectProductionYear = ({ modelData, value, handleClear, disabled, ...props }: Props) => {
  const [productionYearsFiltered, setProductionYearsFiltered] = useState<AutocompleteOption[]>([]);

  useEffect(() => {
    if (modelData) {
      const maxYear = new Date().getFullYear();
      const productionYears = modelData.generations.reduce((s, v, i) => {
        const current = [v.yearStart, v.yearEnd || maxYear] as const;
        if (i === 0) {
          return [current];
        }
        const n = s.findIndex(([start, end]) => inRange(current[0], start, end) || inRange(current[1], start, end));
        if (n >= 0) {
          // eslint-disable-next-line no-param-reassign
          s[n] = [Math.min(current[0], s[n][0]), Math.max(current[1], s[n][1])] as const;
          return s;
        }
        return [...s, current];
      }, [] as (readonly [number, number])[]);

      setProductionYearsFiltered(
        productionYears
          .reduce(
            (s, v) => Array.from(new Set([...s, ...Array.from({ length: v[1] - v[0] + 1 }, (_, i) => i + v[0])])),
            [] as number[],
          )
          .sort((a, b) => a - b)
          .map(mapProductionYear),
      );
    } else {
      setProductionYearsFiltered([]);
    }
  }, [handleClear, modelData]);

  useEffect(() => {
    if (handleClear && value) {
      if (!productionYearsFiltered.map((v) => v.value).includes(+value)) {
        handleClear();
      }
    }
  }, [handleClear, value, productionYearsFiltered]);

  return (
    <Autocomplete
      {...props}
      multiple={false}
      value={value}
      options={productionYearsFiltered}
      disabled={disabled || !productionYearsFiltered.length}
    />
  );
};

export default SelectProductionYear;
