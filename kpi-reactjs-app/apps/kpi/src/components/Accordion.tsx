import * as React from 'react';
import styled from 'styled-components';
import { Card } from 'src/components/Card';

interface AccordionProps {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

const Title = styled.h3<{ isExpanded: boolean }>`
  cursor: pointer;
  margin: ${props => (props.isExpanded ? '0 0 20px' : 0)};
  padding: 0;
  position: relative;
  &::after {
    position: absolute;
    font-size: 1rem;
    font-family: 'LineAwesome';
    text-decoration: inherit;
    text-rendering: optimizeLegibility;
    text-transform: none;
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    font-smoothing: antialiased;
    content: ${props => (props.isExpanded ? '""' : '""')};
    right: 0;
  }
`;

const _Accordion = (props: AccordionProps) => {
  const { className, title, children } = props;
  const [isExpanded, setExpanded] = React.useState(true);
  return (
    <Card className={className}>
      <Title isExpanded={isExpanded} onClick={() => setExpanded(!isExpanded)}>
        {title}
      </Title>
      {isExpanded && children}
    </Card>
  );
};

export const Accordion = styled(_Accordion)`
  display: block;
`;
