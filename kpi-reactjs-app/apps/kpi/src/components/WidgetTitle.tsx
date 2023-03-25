import * as React from 'react';
import styled from 'styled-components';

interface WidgetTitleProps {
  className?: string;
  children: React.ReactNode;
  buttons?: React.ReactNode;
}

const Title = styled.div`
  font-size: 1.1rem;
`;

const _WidgetTitle = (props: WidgetTitleProps) => {
  const { className, children, buttons } = props;
  return (
    <div className={className}>
      <Title>{children}</Title>
      {buttons}
    </div>
  );
};

export const WidgetTitle = styled(_WidgetTitle)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
`;
