import * as React from 'react';
import styled from 'styled-components';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  style?: object;
}

const _Card = (props: CardProps) => {
  const { className, children, style } = props;
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

export const Card = styled(_Card)`
  display: block;
  border: 1px solid #ebedf2;
  border-radius: 0.25rem;
  padding: 1.25rem;
  width: 100%;
`;
