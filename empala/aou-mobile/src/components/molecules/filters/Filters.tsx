import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StyleProp, ViewProps } from 'react-native';

import { calculateNextDirection } from './helpers';
import * as s from './styles';
import { FilterDirection, FilterDirectionPair, FilterOrderItem } from './types';

import { FilterIcon } from '~/assets/icons';

type Props = {
  filtersOrder: FilterOrderItem[];
  justify?: string;
  style?: StyleProp<ViewProps>;
  onChange: (filter: FilterDirectionPair) => void;
};

export const Filters = ({
  filtersOrder,
  justify,
  style,
  onChange,
}: Props): JSX.Element => {
  const [filter, setFilter] = useState<FilterDirectionPair>({});
  const handlePress = useCallback((id: string | number) => {
    const direction = calculateNextDirection(filter[id]);

    setFilter({ ...filter, [id]: direction });
  }, [filter]);

  const filters = useMemo(() => filtersOrder.map(({ id, label }) => (
    { id, label, direction: filter[id] ?? FilterDirection.disabled }
  )), [filtersOrder, filter]);

  useEffect(() => {
    onChange(filter);
  }, [filter, onChange]);

  return (
    <s.Wrapper style={style}>
      <FilterIcon />
      <s.Filters justify={justify}>
        {filters.map(({ id, label, direction }) => (
          <s.Filter key={id} onPress={() => handlePress(id)}>
            <s.FilterLabelWrapper>
              <s.FilterLabel>
                {label}
              </s.FilterLabel>
              <s.FilterLabelUnderline />
            </s.FilterLabelWrapper>
            <s.FilterArrowIconWrapper
              hidden={direction === FilterDirection.disabled}
            >
              <s.FilterArrowIcon
                style={{ transform: [{ rotate: direction === FilterDirection.up ? '180deg' : '0deg' }] }}
              />
            </s.FilterArrowIconWrapper>
          </s.Filter>
        ))}
      </s.Filters>
    </s.Wrapper>
  );
};
