import * as React from 'react';
import { SelectOption } from 'src/types';

interface OptionsValueProps {
  options: SelectOption[];
  value: any;
}

export function OptionsValue(props: OptionsValueProps) {
  const { options, value } = props;
  const current = options.find(x => x.value === value);
  return <>{current ? current.label : null}</>;
}
