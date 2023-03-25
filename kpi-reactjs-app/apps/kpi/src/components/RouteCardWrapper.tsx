import * as React from 'react';
import styled from 'styled-components';

interface RouteCardWrapperProps {
  className?: string;
  children: React.ReactNode;
}

const _RouteCardWrapper = (props: RouteCardWrapperProps) => {
  const { className, children } = props;
  return <div className={className}>{children}</div>;
};

export const RouteCardWrapper = styled(_RouteCardWrapper)`
  display: flex;
  flex-wrap: wrap;
  padding-top: 30px;
  width: 100%;
`;
