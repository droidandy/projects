import * as React from 'react';
import styled from 'styled-components';
import { WIZARD_BREAKPOINT } from './Wizard';

interface WizardMenuItemProps {
  className?: string;
  title: string;
  icon: React.ReactNode;
  active?: boolean;
  clickable?: boolean;
  onClick: () => void;
}

const Icon = styled.div`
  font-size: 2.5rem;
  margin-right: 1.1rem;
`;
const Label = styled.div`
  color: #50566a;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
`;
const Inner = styled.div`
  display: flex;
`;

const _WizardMenuItem = (props: WizardMenuItemProps) => {
  const { className, icon, title, onClick, clickable } = props;
  return (
    <a className={className} onClick={clickable ? onClick : undefined}>
      <Inner>
        <Icon>{icon}</Icon>
        <Label>{title}</Label>
      </Inner>
    </a>
  );
};

export const WizardMenuItem = styled(_WizardMenuItem)`
  display: block;
  padding: 0.75rem 1.5rem;
  position: relative;
  border-radius: 0.5rem;
  background-color: ${props => (props.active ? '#f4f6f9' : null)};
  opacity: ${props => (props.clickable ? 1 : 0.6)};
  cursor: ${props => (props.clickable ? 'pointer' : 'not-allowed')};

  i {
    color: ${props => (props.active ? '#5d78ff' : '#959cb6')};
  }

  &:after {
    display: ${props => (props.active ? 'block' : 'none')};
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    content: ' ';
    height: 0;
    width: 0;
    border: solid transparent;
    position: absolute;
    border-left-color: #f4f6f9;
    border-width: 1rem;
    ${WIZARD_BREAKPOINT} {
      display: none;
    }
  }
`;
