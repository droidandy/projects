import React from 'react';

import { FormItem, FormItemCommonProps } from '../../FormItem/FormItem';
import { Input, InputProps } from '../Input/Input';

interface Props extends InputProps, FormItemCommonProps {}

export const InputFormItem: React.FC<Props> = ({
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
    <Input {...rest} />
  </FormItem>
);
