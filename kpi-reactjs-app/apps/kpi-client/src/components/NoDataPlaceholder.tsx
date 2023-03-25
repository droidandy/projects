import * as React from 'react';
import styled from 'styled-components';
import { NoDataImage } from './NoDataImage';

interface NoDataPlaceholderProps {
  className?: string;
  children: React.ReactNode;
}

const Text = styled.div`
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
  text-align: center;
  white-space: pre;
  color: #c7d0d9;
  margin-bottom: 15px;
`;

const _NoDataPlaceholder = (props: NoDataPlaceholderProps) => {
  const { className, children } = props;
  return (
    <div className={className}>
      <Text>{children}</Text>
      <NoDataImage />
    </div>
  );
};

export const NoDataPlaceholder = styled(_NoDataPlaceholder)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
