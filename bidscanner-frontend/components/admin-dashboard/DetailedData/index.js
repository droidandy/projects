/* @flow */
import React from 'react';
import styled from 'styled-components';

// import type { MetaProps, InputProps } from 'redux-form';

import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import withProps from 'recompose/withProps';
import withRefs from 'utils/hoc/withRefs';

import Popover from 'material-ui/Popover';
// import Menu from './Menu';
// import InfoIcon from '../InfoIcon';
// import Input from '../Input';

const Button = styled.button`
  all: inherit;
  display: inline-block;
  border: 0 none;
  background: transparent;
  cursor: pointer;

  &:hover {
    color: #bcbec0;
  }

  &:focus,
  &:active {
    outline: none;
  }
`;

const Container = styled.div`
  border: 1px solid #bcbec0;
  background: white;
  padding: 8px 12px;
`;

type RecomposeProps = {
  popoverDisplayed: boolean,
  setRef: string => any => void,
  refs: any,
  onButtonClick: () => void,
  onPopoverClose: () => void,
};

type ExternalProps = {
  text: string,
  children: any,
  className?: string,
};

const enhance = compose(
  withState('popoverDisplayed', 'setPopoverDisplayed', false),
  withProps(props => ({
    displayValue: props.value ? props.getDisplayValue(props.value) : '',
  })),
  withRefs(),
  withHandlers({
    onButtonClick: props => () => {
      props.setPopoverDisplayed(true);
    },
    onPopoverClose: props => () => {
      props.setPopoverDisplayed(false);
    },
  })
);

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { text, children, className, popoverDisplayed, onPopoverClose, onButtonClick, setRef, refs } = props;

  return (
    <Button className={className} innerRef={setRef('anchor')} onClick={onButtonClick}>
      {text}
      <Popover
        open={popoverDisplayed}
        anchorEl={refs.anchor}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
        targetOrigin={{ horizontal: 'left', vertical: 'top' }}
        style={{ boxShadow: 'none', maxWidth: '450px' }}
        onRequestClose={onPopoverClose}
      >
        <Container>
          {children}
        </Container>
      </Popover>
    </Button>
  );
});

export default EnhancedComponent;
