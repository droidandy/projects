import * as React from 'react';
import styled from 'styled-components';
import { colors } from 'src/common/utils';

interface PerformanceColorProps {
  className?: string;
  children: React.ReactNode;
  color: string;
}

type AllowedColors = keyof typeof colors;

const _PerformanceColor = (props: PerformanceColorProps) => {
  const { className, children } = props;
  return <span className={className}>{children}</span>;
};

export const PerformanceColor = styled(_PerformanceColor)`
  display: inline-block;
  padding: 3px 8px;
  color: white;
  background: ${props => colors[props.color as AllowedColors] || '#666'};
  border-radius: 4px;
`;
