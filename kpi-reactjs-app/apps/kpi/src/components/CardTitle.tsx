import * as React from 'react';
import styled from 'styled-components';
import { ButtonGroup } from './ButtonGroup';

interface CardTitleProps {
  className?: string;
  children?: React.ReactNode;
  buttons?: React.ReactNode;
  style?: object;
}

const _CardTitle = (props: CardTitleProps) => {
  const { className, children, buttons, style } = props;
  return (
    <div className={className} style={style}>
      <h3>{children}</h3>
      {buttons && <ButtonGroup>{buttons}</ButtonGroup>}
    </div>
  );
};

export const CardTitle = styled(_CardTitle)`
  display: flex;
  ${ButtonGroup} {
    margin-left: auto;
  }
  h3 {
    margin: 0;
    padding: 0;
  }
`;
