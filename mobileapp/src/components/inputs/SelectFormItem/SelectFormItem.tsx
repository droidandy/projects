import React from 'react';

import { FormItem, FormItemCommonProps } from '../../FormItem/FormItem';
import { Select, SelectProps } from '../Select/Select';

interface Props extends SelectProps, FormItemCommonProps {}

export const SelectFormItem: React.FC<Props> = ({
  itemStartAdornment,
  itemEndAdornment,
  itemStyle,
  ...rest
}: Props) => (
  <FormItem
    key="container"
    startAdornment={itemStartAdornment}
    endAdornment={itemEndAdornment}
    style={itemStyle}
  >
    <Select {...rest} />
  </FormItem>
);
