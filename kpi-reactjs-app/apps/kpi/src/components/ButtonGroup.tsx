import * as React from 'react';
import styled from 'styled-components';
import { Button } from './Button';

interface ButtonGroupProps {
  className?: string;
  children: React.ReactNode;
}

const _ButtonGroup = (props: ButtonGroupProps) => {
  const { className, children } = props;
  return <div className={className}>{children}</div>;
};

export const ButtonGroup = styled(_ButtonGroup)`
  position: relative;
  display: inline-flex;
  vertical-align: middle;
  > ${Button}:not(:last-child),
  > a:not(:last-child) > ${Button} {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  > ${Button}:not(:first-child),
  > a:not(:first-child) > ${Button} {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: -1px;
  }
`;
