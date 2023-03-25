import React from 'react';
import styled from 'styled-components/native';

type Props = {
  valueChange: string;
  percentage: number;
};

export const ValueChange = ({ valueChange, percentage }: Props): JSX.Element => {
  const valueChangeNumeric = Number(valueChange.replace(',', ''));

  const grow = valueChangeNumeric >= 0;
  const percentageChange = `${grow ? '' : '-'}$${valueChange.replace('-', '')} (${percentage}%)`;

  return (
    <Wrapper grow={grow}>
      {percentageChange}
    </Wrapper>
  );
};

export const Wrapper = styled.Text<{ grow: boolean; }>`
  font-size: 11px;
  line-height: 16px;
  color: ${({ grow }): string => (grow ? '#10B981' : '#F43F5E')};
  align-items: center;
`;
