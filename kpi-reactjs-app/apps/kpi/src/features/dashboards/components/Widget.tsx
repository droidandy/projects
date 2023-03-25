import * as React from 'react';
import styled from 'styled-components';
import { TransString } from 'src/types-next';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Card } from 'src/components/Card';

interface WidgetProps {
  className?: string;
  name: TransString;
  description: TransString;
  children: React.ReactNode;
}

const Title = styled.h3`
  margin: 0;
`;
const Description = styled.p`
  margin: 0;
`;

const _Widget = (props: WidgetProps) => {
  const { className, name, description, children } = props;
  return (
    <Card className={className}>
      <Title>
        <DisplayTransString value={name} />
      </Title>
      <Description>
        <DisplayTransString value={description} />
      </Description>
      {children}
    </Card>
  );
};

export const Widget = styled(_Widget)`
  display: block;
  margin-bottom: 20px;
`;
