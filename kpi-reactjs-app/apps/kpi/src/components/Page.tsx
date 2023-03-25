import * as React from 'react';
import styled from 'styled-components';

interface PageProps {
  className?: string;
  children: React.ReactNode;
  flex?: boolean;
}

const _Page = (props: PageProps) => {
  const { className, children } = props;
  return <div className={className}>{children}</div>;
};

export const Page = styled(_Page)`
  display: ${props => (props.flex ? 'flex' : 'block')};
  max-width: 100%;
  padding: 25px;
  flex: 1 0 0;
  background: #f2f3f8;
`;
