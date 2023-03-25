import React from 'react'
import { Select } from 'src/components/Select';

interface ReactSelectProps {
  name: string;
  placeholder?: string;
  options: any;
  value?: Array<any>;
  showIndicators?: boolean;
  isMulti?: boolean;
  onChange: (date: any) => any;
  onBlur: () => any;
}

export default function ReactSelect(props: ReactSelectProps) {
  const { 
    name, 
    placeholder, 
    options, 
    value,
    showIndicators, 
    isMulti,
    onChange, 
    onBlur 
  } = props;

  const styles = {
    indicatorsContainer: () => ({ display: showIndicators ? '' : 'none' }),
    indicatorSeparator: () => ({ display: 'none' }),
    multiValue: () => ({ 
      backgroundColor: 'white',
      border: '1px solid #DEE1E9',
      display: 'flex',
      borderRadius: '3px',
      margin: '0px 3px',
    }),
    placeholder: () => ({
      color: '#244159',
    }),
  }

  return (
    <Select
      name={name}
      isMulti={(isMulti === undefined || isMulti) ? true : false}
      options={options}
      isClearable={false}
      styles={styles}
      value={value ? value : null}
      placeholder={placeholder}
      onChange={ values => onChange(values) }
      onBlur={ () => onBlur() }
    />
  );
}