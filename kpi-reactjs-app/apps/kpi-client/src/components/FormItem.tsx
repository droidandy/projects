import * as React from 'react';
import styled from 'styled-components';
import { rtlMargin, rtlTextRight } from 'shared/rtl';
import { Trans } from 'react-i18next';

interface FormItemProps {
  className?: string;
  label: React.ReactNode;
  children: React.ReactNode;
  required?: boolean;
  labelMinWidth?: number;
  vertical?: boolean;
  labelTop?: boolean;
}

export const FormItemLabel = styled.div`
  ${rtlMargin(0, '8px')}
  ${rtlTextRight()}
  flex-shrink: 0;
  width: 10%;
`;

const _FormItem = (props: FormItemProps) => {
  const { className, label, children, required } = props;
  return (
    <div className={className}>
      <FormItemLabel>
        <Trans>{label}</Trans>
        {required && <>&nbsp;*</>}:
      </FormItemLabel>
      {children}
    </div>
  );
};

export const FormItem = styled(_FormItem)`
  display: flex;
  align-items: center;
  margin-top: 15px;
  ${props =>
    props.vertical &&
    `
    flex-direction: column;
    &:first-child {
      margin-top: 0;
    }
    ${FormItemLabel} {
      width: auto;
      text-align: left;
      margin: 0;
      align-self: flex-start;
    }
  `}
  > :last-child:not(:first-child) {
    width: 100%;
    margin-bottom: 0;
  }

  ${props =>
    props.labelTop &&
    `${FormItemLabel} {
      align-self: flex-start;
      padding-top: 10px;
  }`}
`;
