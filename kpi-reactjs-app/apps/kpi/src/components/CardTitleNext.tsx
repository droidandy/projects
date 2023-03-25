import * as React from 'react';
import styled from 'styled-components';

interface CardTitleNextProps {
  className?: string;
  children: React.ReactNode;
}

const _CardTitleNext = (props: CardTitleNextProps) => {
  const { className, children } = props;
  return (
    <div className={className}>
      <h2>{children}</h2>
    </div>
  );
};

export const CardTitleNext = styled(_CardTitleNext)`
  border-bottom: 1px solid #ebedf2;
  margin: -1.25rem -1.25rem 0;
  padding: 1.5rem 2rem;
  min-height: 60px;
  display: flex;
  align-items: center;
  h2 {
    font-size: 1.2rem;
    margin: 0;
    padding: 0;
    font-weight: normal;
  }
`;
