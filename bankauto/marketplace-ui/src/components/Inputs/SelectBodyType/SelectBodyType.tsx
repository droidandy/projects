import React, { useEffect, useState } from 'react';
import Select, { SelectOption, Props as SelectProps } from '@marketplace/ui-kit/components/Select';
import { Node, BodyType } from '@marketplace/ui-kit/types';
import { generationFilter, GenerationFilter } from 'helpers/generationFilter';

type BodyTypesRecord = Record<number, SelectOption>;

interface Props extends Omit<SelectProps, 'options' | 'value' | 'disabled'> {
  modelData?: {
    generations: {
      id: number;
      name: string;
      status: string;
      bodyTypeId: number;
      bodyType: BodyType;
      yearStart: number;
      yearEnd?: number;
    }[];
  };
  filter?: GenerationFilter;
  value?: string | number | null;
  handleClear?: () => void;
  disabled?: boolean;
}

const mapBodyType = (i: Node): SelectOption => ({ label: i.name, value: i.id });

const SelectBodyType = ({ modelData, filter, value, handleClear, disabled, ...props }: Props) => {
  const [bodyTypesFiltered, setBodyTypesFiltered] = useState<SelectOption[]>([]);

  useEffect(() => {
    if (modelData) {
      const bodyTypesRecord = generationFilter(modelData.generations, filter || {}).reduce((s, i) => {
        return !s[i.bodyTypeId] ? { ...s, [i.bodyTypeId]: mapBodyType(i.bodyType) } : s;
      }, {} as BodyTypesRecord);
      setBodyTypesFiltered(Object.values(bodyTypesRecord));
    } else {
      setBodyTypesFiltered([]);
    }
  }, [handleClear, modelData]);

  useEffect(() => {
    if (handleClear && value) {
      if (!bodyTypesFiltered.map((v) => v.value).includes(+value)) {
        handleClear();
      }
    }
  }, [handleClear, value, bodyTypesFiltered]);

  return (
    <Select {...props} value={value} options={bodyTypesFiltered} disabled={disabled || !bodyTypesFiltered.length} />
  );
};

export default SelectBodyType;
