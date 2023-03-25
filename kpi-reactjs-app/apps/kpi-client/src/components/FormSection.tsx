import * as React from 'react';
import styled from 'styled-components';

interface FormSectionProps {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

const Header = styled.div`
  background: #f7f9fc;
  font-weight: 600;
  font-size: 14px;
  padding: 14px 30px;
  color: #110000;
`;

const Content = styled.div`
  padding-top: 20px;
`;

const _FormSection = (props: FormSectionProps) => {
  const { className, title, children } = props;
  return (
    <div className={className}>
      <Header>{title}</Header>
      <Content>{children}</Content>
    </div>
  );
};

export const FormSection = styled(_FormSection)`
  display: block;
  & + & {
    margin-top: 40px;
  }
`;
