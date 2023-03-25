import React from 'react';
import styled from 'styled-components';
import { WizardMenuItem } from './WizardMenuItem';
import { Portlet } from './Portlet';

export const WIZARD_BREAKPOINT = `@media (max-width: 1250px)`;

interface WizardProps {
  onTab: (index: number) => any;
  index: number;
  maxStepIndex: number;
  steps: Array<{
    title: string;
    icon: React.ReactNode;
    content: React.ReactNode;
  }>;
}

const Wrapper = styled.div`
  display: flex;
  ${WIZARD_BREAKPOINT} {
    flex-direction: column;
  }
`;
const Left = styled.div`
  width: 300px;
  border-right: 1px solid #eeeef4;
  padding: 4.5rem 2.5rem 4.5rem 1.5rem;
  ${WIZARD_BREAKPOINT} {
    width: 100%;
    border-right: none;
    padding-bottom: 0;
  }
`;

const Right = styled.div`
  padding: 4rem 6rem 6rem;
  flex: 1 0 auto;
  width: calc(100% - 300px);
  ${WIZARD_BREAKPOINT} {
    width: 100%;
    padding-top: 1rem;
  }
`;

export function Wizard(props: WizardProps) {
  const { onTab, index, steps, maxStepIndex } = props;
  return (
    <Portlet>
      <Wrapper>
        <Left>
          {steps.map((step, i) => (
            <WizardMenuItem
              key={i}
              title={step.title}
              icon={step.icon}
              onClick={() => onTab(i)}
              clickable={i <= maxStepIndex}
              active={i === index}
            />
          ))}
        </Left>
        <Right>{steps[index].content}</Right>
      </Wrapper>
    </Portlet>
  );
}
