import React from 'react'
import DatePicker from 'react-date-picker';
import { CalendarIcon } from '../../icons';

interface DatePickerProps {
  name: string;
  value?: Date | Date[];
  selectRange?: boolean;
  onChange: (date: any) => any;
  isOpen?: boolean;
}

export default function ReactDatePicker(props: DatePickerProps) {
  const { name, onChange, value, selectRange, isOpen } = props;
  return (
    <DatePicker
      name={name}
      onChange={ (date: Date | Date[]) => {
        onChange(date);
      }}
      isOpen={isOpen}
      selectRange={selectRange}
      value={value}
      clearIcon={null}
      calendarIcon={<CalendarIcon />}
    />
  );
}