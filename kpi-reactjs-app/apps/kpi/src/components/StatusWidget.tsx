import * as React from 'react';
import styled from 'styled-components';

interface StatusWidgetProps {
  className?: string;
  title: React.ReactNode;
  description: React.ReactNode;
}

const Title = styled.div`
  display: block;
  color: #595d6e;
  font-weight: 600;
  font-size: 0.95rem;
`;
const Description = styled.div`
  display: block;
  color: #48465b;
  font-weight: 600;
  font-size: 1.2rem;
`;

const _StatusWidget = (props: StatusWidgetProps) => {
  const { className, title, description } = props;
  return (
    <div className={className}>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </div>
  );
};

export const StatusWidget = styled(_StatusWidget)`
  /* display: flex; */
  /* align-items: center; */
  flex-grow: 1;
  padding: 2rem 1.5rem 0 0;
  /* flex-direction: column; */
`;
