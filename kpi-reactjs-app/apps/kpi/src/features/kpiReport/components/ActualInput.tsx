import { Input } from 'src/components/FormInput';
import React from 'react';
import { useActions } from 'typeless';
import { KpiReportActions } from '../interface';

export interface ActualInputProps {
  kpiDataSeriesId: number;
  value: number | null;
}

export function ActualInput(props: ActualInputProps) {
  const input = React.useRef<HTMLInputElement>(null!);
  const { updateValue } = useActions(KpiReportActions);

  const timeoutRef = React.useRef(0 as any);

  React.useLayoutEffect(() => {
    if (props.value) {
      input.current!.value = props.value.toString();
    }
  }, []);

  React.useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <Input
      style={{ width: 80 }}
      ref={input}
      onChange={e => {
        const strValue = e.target.value;
        const newValue = Number(strValue);
        if (!strValue || strValue === '' || isNaN(newValue)) {
          return;
        }
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          updateValue(newValue, props.kpiDataSeriesId);
        }, 500);
      }}
    />
  );
}
