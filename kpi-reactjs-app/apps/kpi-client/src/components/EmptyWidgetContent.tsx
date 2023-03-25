import * as React from 'react';
import styled from 'styled-components';

interface EmptyWidgetContentProps {
  className?: string;
  title: string;
  children: React.ReactChild;
}

const Title = styled.div`
  font-weight: bold;
  font-size: 24px;
  color: #c7d0d9;
  text-align: center;
  max-width: 230px;
  margin: 0 auto;
  margin-top: 30px;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: auto;
    height: 310px;
  }
`;

const _EmptyWidgetContent = (props: EmptyWidgetContentProps) => {
  const { className, title, children } = props;
  return (
    <div className={className}>
      <Title>{title}</Title>
      <Inner>{children}</Inner>
    </div>
  );
};

export const EmptyWidgetContent = styled(_EmptyWidgetContent)`
  display: block;
`;
