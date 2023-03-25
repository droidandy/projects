import * as React from 'react';
import styled from 'styled-components';

interface WidgetProps {
  className?: string;
  title: React.ReactChild;
}

const Title = styled.div`
  background: #066a99;
  font-weight: bold;
  font-size: 16px;
  color: white;
  height: 50px;
`;

const _Widget = (props: WidgetProps) => {
  const { className, title } = props;
  return (
    <div className={className}>
      <Title>{title}</Title>
    </div>
  );
};

export const Widget = styled(_Widget)`
  display: block;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 0px 2px 15px rgba(0, 0, 0, 0.08);
`;
