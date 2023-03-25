import * as React from 'react';
import styled from 'styled-components';
import { ArrowIcon } from './ArrowIcon';

interface AccordionProps {
  className?: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

const Title = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 30px;
  background: #f7f9fc;
  color: #244159;
  font-weight: bold;
  svg {
    margin: 0 8px;
  }
  cursor: pointer;
`;

const _Accordion = (props: AccordionProps) => {
  const { className, title, children } = props;
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className={className}>
      <Title onClick={() => setIsExpanded(!isExpanded)}>
        {title}
        <ArrowIcon direction={isExpanded ? 'up' : 'down'} />
      </Title>
      {isExpanded && children}
    </div>
  );
};

export const Accordion = styled(_Accordion)`
  display: block;
  margin-bottom: 5px;
`;
