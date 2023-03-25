import React, {useState} from 'react'
import styled from 'styled-components';
import { Input } from '../../common/FormInput/Input'

interface DateRangePickerProps {
  name: string;
  value: (Date | undefined)[];
  onChange: (date: any) => any;
}
const StyledLabel = styled.label`
  position: absolute;
  top: 1px;
  left: 55px;
  right: 17px;
  border: none;
  height: 36px;

  padding-top: 8px;
  padding-right: 10px;
  background: white;
  color: #304c63;
`;

const formatDateRange = (date: (Date | undefined)[]) => {
  if (!date[0] || !date[1]) return '';
  const from = date[0] > date[1] ? date[1] : date[0];
  const to = date[0] > date[1] ? date[0] : date[1];
  const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun",
    "Jul", "Aug", "Sep",
    "Oct", "Nov", "Dec"
  ];
  return monthNames[from.getMonth()] + ' ' + from.getDate() 
    + ' - ' + monthNames[to.getMonth()] + ' ' + to.getDate();
}

export default function DateRangePicker(props: DateRangePickerProps) {
  const { name, onChange, value } = props;
  const [ isOpen, setIsOpen ] = useState(false);

  return (
    <>
      <Input
        name={name}
        type="date"
        selectRange
        value={value}
        isOpen={isOpen}
        onBlur={() => {}}
        onChange = {val => {
          setIsOpen(false);
          onChange(val);
        }}
      />
      <StyledLabel onClick={ () => {
        setIsOpen(true);
      }}
      >
        {formatDateRange(value)}
      </StyledLabel>
    </>
  );
}