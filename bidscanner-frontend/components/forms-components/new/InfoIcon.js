/* @flow */
import React from 'react';
import styled from 'styled-components';

import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import InfoIcon from 'material-ui/svg-icons/action/info-outline';

const Container = styled.div`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 36px;
`;

const StyledInfoIcon = styled(InfoIcon)`
  width: 16px !important;
  height: 16px !important;
  fill: #bcbec0 !important;
  cursor: pointer;
  position: absolute;
  right: 4px;
  top: 7px;
  z-index: 29;
`;

const Size = 16;
const StrokeColor = '#BCBEC0';
const Offset = 15;

const TooltipContainer = styled.div`
  position: absolute;
  background: white;
  padding: 12px;
  border-radius: 10px;
  border: 2px solid ${StrokeColor};
  z-index: 30;
  right: -${Offset + 7}px;
  top: 40px;
  max-width: 250px;

  @media (max-width: 500px) {
    right: -${Offset - 5}px;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    border: solid;
    border-width: 0 ${Size}px ${Size}px;
    border-color: ${StrokeColor} transparent;
    top: -${Size}px;
    right: ${Offset}px;
  }

  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    border: solid;
    border-width: 0 ${Size - 2}px ${Size - 2}px;
    border-color: white transparent;
    top: -${Size - 2}px;
    right: ${Offset + 2}px;
  }

  & a.__anchor {
    position: absolute;
    display: inline-block;
    height: 0px;
    width: 0px;
    opacity: 0.01;
  }
`;

const enhance = compose(
  withState('infoDisplayed', 'setInfoDisplayed', false),
  withHandlers({
    onInfoClick: props => () => {
      props.setInfoDisplayed(true);
    },
    onInfoBlurred: props => () => {
      props.setInfoDisplayed(false);
    },
  })
);

type RecomposeProps = {
  infoDisplayed: boolean,
  onInfoClick: () => void,
  onInfoBlurred: () => void,
};

type ExternalProps = {
  text: string,
  className?: string,
};

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { className, text, onInfoClick, onInfoBlurred, infoDisplayed } = props;

  return (
    <Container className={className}>
      <StyledInfoIcon onClick={onInfoClick} />
      {infoDisplayed && (
        <TooltipContainer>
          <a href="#tooltip" className="__anchor" ref={el => el && el.focus()} onBlur={onInfoBlurred}>
            Anchor
          </a>
          {text}
        </TooltipContainer>
      )}
    </Container>
  );
});

export default EnhancedComponent;
