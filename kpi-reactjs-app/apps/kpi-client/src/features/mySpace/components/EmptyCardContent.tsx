import * as React from 'react';
import styled from 'styled-components';

interface EmptyCardContentProps {
  className?: string;
  title: string;
  children: React.ReactNode;
}

const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
  color: #c7d0d9;
  text-align: center;
  max-width: 230px;
  margin: 0 auto;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  svg {
    width: 100%;
  }
`;

const _EmptyCardContent = (props: EmptyCardContentProps) => {
  const { className, title, children } = props;
  return (
    <div className={className}>
      <Title>{title}</Title>
      <Content>{children}</Content>
    </div>
  );
};

export const EmptyCardContent = styled(_EmptyCardContent)`
  display: block;
`;
