import React from 'react';
import styled, { css, createGlobalStyle } from 'styled-components';
import ReactSelect from './ReactSelect';
import ReactDatePicker from "./ReactDatePicker";
import QuillEditor from "./QuillEditor";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  error?: React.ReactNode | null;
  width?: string;
  type?: string;
  value?: any;
  options?: Array<any>;
  showIndicators?: boolean;
  isMulti?: boolean;
  name: string;
  selectRange?: boolean;
  onChange: (value: any) => any;
  onBlur: () => any;
  isOpen?: boolean;
}

const StyledInput = styled.input`
  width: 100%;
  display: block;
  padding: 0 15px;
  line-height: 1.5;
  height: 38px;
  box-shadow: none !important;
  outline: 0;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee1e9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &&::placeholder {
    color: #244159;
    opacity: 1;
  }
`;

const StyledDatePicker = styled(ReactDatePicker)`
  width: 100%;
  display: block;
  line-height: 1.5;
  height: 38px;
  box-shadow: none !important;
  outline: 0;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee1e9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &&::placeholder {
    color: #244159;
    opacity: 1;
  }
`;

const StyledQuillEditor = styled(QuillEditor)`
  width: 100%;
  display: block;
  line-height: 1.5;
  height: 38px;
  box-shadow: none !important;
  outline: 0;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee1e9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &&::placeholder {
    color: #244159;
    opacity: 1;
  }
`;

const StyledReactSelect = styled(ReactSelect)`
  width: 100%;
  display: block;
  line-height: 1.5;
  height: 38px;
  box-shadow: none !important;
  outline: 0;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #dee1e9;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  &&::placeholder {
    color: #244159;
    opacity: 1;
  }
`;

const DatePickerStyle = createGlobalStyle`
  .react-date-picker {
    width: 100%;
    height: 38px;
  }

  .react-date-picker__wrapper {
    border-radius: 4px;
    border: 1px solid #dee1e9 !important;
  }

  .react-date-picker input {
    outline: none;
  }

  .react-date-picker button {
    outline: none;
    padding-left: 15px;
  }

  .react-date-picker__inputGroup {
    direction: ltr;
    text-align: right;
  }

  .react-date-picker__inputGroup > input:first-child{
    top: 0px !importat;
    left: 0px !important;
  }
`;

const QuillEditorStyle = createGlobalStyle`
  .ql-editor {
    text-align: right !important;
    font-size: 14px !important;
  }
  .ql-snow .ql-picker:not(.ql-color-picker):not(.ql-icon-picker) svg {
    left: 0 !important;
    right: auto !important;
  }
  .ql-snow .ql-picker.ql-header {
    width: 80px !important;
  }
  .ql-editor.ql-blank::before {
    right: 15px;
    top: 12px;
    color: #244159 !important;
    font-style: normal !important;
    font-weight: normal;
  }
  .ql-container {
    height: 130px !important;
  }
  .ql-editor li:not(.ql-direction-rtl)::before {
    margin-left: 0px !important;
  }
`;

const Wrapper = styled.div`
  border-radius: 4px;

  :focus-within {
    color: #495057;
    background-color: #fff;
    border-color: #9aabff;
    outline: 0;
  }
  text-align: right;
`;

const _Input = React.forwardRef((props: InputProps, ref) => {
  const { 
    width, 
    className, 
    error, 
    style,
    type,
    options,
    value,
    onChange,
    onBlur,
    ...rest 
  } = props;

  if (type && type === 'date') {
    return (
      <Wrapper className={className}>
        <DatePickerStyle />
        <StyledDatePicker 
          value={value}
          onChange={ date => onChange(date)}
          {...rest}
        />
      </Wrapper>
    );
  }

  if (type && type === 'editor') {
    return (
      <Wrapper className={className}>
        <QuillEditorStyle />
        <StyledQuillEditor 
          value={value}
          onBlur={ (text) => {
            onBlur();
            onChange(text);
          }}
          {...rest}
        />
      </Wrapper>
    );
  }

  if (type && type === 'select') {
    return (
      <Wrapper className={className}>
        <StyledReactSelect
          value={value}
          options={options}
          onChange={ values => onChange(values)}
          onBlur={ () => onBlur()}
          {...rest}
        />
      </Wrapper>
    )
  }

  return (
    <Wrapper className={className}>
      <StyledInput
        ref={ref as any}
        {...rest}
        as={
          type && type === 'multiline' ? 'textarea' : 'input'
        }
        type={type}
        defaultValue={value}
        onBlur={ (e) => {
          onBlur();
          onChange(e.target.value);
        }}
        style={
          type && type === 'multiline'
            ? {
                ...style,
                padding: '10px 15px',
                resize: 'none',
                minHeight: '78px',
              }
            : style
        }
      />
    </Wrapper>
  );
});

export const Input = styled(_Input)`
  display: block;
  ${props => props.width && 
    css`
      width: ${props.width};
    `};
  ${props =>
    props.error &&
    css`
      border-color: #dc3545;
      &:focus {
        box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.25);
      }
    `};
`;
