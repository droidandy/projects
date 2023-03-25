// @flow
import React from 'react';
import styled from 'styled-components';

import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

const TrackWidth = 32;
const TrackHeight = 18;
const ThumbSize = 12;
const OffsetX = 2;
const TrackThumbDiff = (TrackHeight - ThumbSize) / 2;

const Container = styled.div`
  display: inline-block;
  position: relative;
  cursor: pointer;
  width: ${TrackWidth}px;
  height: ${Math.max(TrackHeight, ThumbSize)}px;
`;

const Track = styled.div`
  position: absolute;
  top: ${TrackThumbDiff < 0 ? -TrackThumbDiff : 0}px;
  left: 0;
  width: ${TrackWidth}px;
  height: ${TrackHeight}px;
  border-radius: ${TrackHeight / 2}px;
  border: 1px solid #e1e1e1;
  background: white;
  transition: all 1s ease-out;
`;

const Thumb = styled.div`
  position: absolute;
  top: ${TrackThumbDiff > 0 ? TrackThumbDiff : 0}px;
  left: ${props => (props.value ? `${TrackWidth - OffsetX - ThumbSize - 1}px` : `${OffsetX + 1}px`)};
  width: ${ThumbSize}px;
  height: ${ThumbSize}px;
  border: 1px solid ${props => (props.value ? '#3dca26' : '#FF2929')};
  border-radius: 50%;
  background: white;
  transition: all 0.2s ease-out;
`;

const enhance = compose(
  // Remove this `withState` to disable demo mode
  withState('value', 'onChange', props => {
    if (!props.demo) {
      throw new Error(
        "Switcher component is in demo mode. Use 'demo' property or disable demo mode in component sources"
      );
    }

    return props.value;
  }),
  withHandlers({
    onClick: props => () => {
      props.onChange(!props.value);
    },
  })
);

type RecomposeProps = {
  onClick: () => void,
};

type ExternalProps = {
  value: boolean,
  onChange: boolean => void,
};

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { value, onClick } = props;

  return (
    <Container onClick={onClick}>
      <Track value={value} />
      <Thumb value={value} />
    </Container>
  );
});

export default EnhancedComponent;
