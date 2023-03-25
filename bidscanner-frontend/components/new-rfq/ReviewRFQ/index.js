// @flow
import React from 'react';
// import styled from 'styled-components';

import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';

import { Box } from 'grid-styled';
import BlackButton from 'components/styled/BlackButton';
import MutedText from 'components/styled/MutedText';
import Dialog from 'components/general/Dialog';
import RFQDetails from 'components/rfq-details/RFQDetails';
import UrgentDialogContent from './UrgentDialogContent';
import CongratsDialogContent from './CongratsDialogContent';

const enhance = compose(
  withState('urgentIsOpened', 'setUrgentOpened', false),
  withState('congratsIsOpened', 'setCongratsOpened', false),
  withHandlers({
    onPost: props => () => {
      props.setUrgentOpened(true);
    },
    onAfterUrgent: props => () => {
      props.setUrgentOpened(false);
      props.setCongratsOpened(true);
    },
    onAfterCongrats: props => () => {
      props.setCongratsOpened(false);
    },
    handleClose: props => () => {
      props.setUrgentOpened(false);
      props.setCongratsOpened(false);
    },
  })
);

type RecomposeProps = {
  urgentIsOpened: boolean,
  congratsIsOpened: boolean,
  onPost: () => void,
  onAfterUrgent: () => void,
  onAfterCongrats: () => void,
  handleClose: () => void,
};

type ExternalProps = {};

type EnhancedType = Class<React$Component<void, ExternalProps, void>>;

const EnhancedComponent: EnhancedType = enhance((props: ExternalProps & RecomposeProps) => {
  const { onPost, onAfterUrgent, onAfterCongrats, handleClose, urgentIsOpened, congratsIsOpened } = props;

  return (
    <div>
      <Box mb={3}>
        <MutedText.Button>
          {'< back to RFQ details'}
        </MutedText.Button>
      </Box>
      <RFQDetails {...props} previewMode />
      <Box mt={3}>
        <BlackButton onClick={onPost}>Post RFQ</BlackButton>
      </Box>
      <Dialog open={urgentIsOpened} onRequestClose={handleClose}>
        <UrgentDialogContent onNext={onAfterUrgent} />
      </Dialog>
      <Dialog open={congratsIsOpened} onRequestClose={handleClose}>
        <CongratsDialogContent onNext={onAfterCongrats} />
      </Dialog>
    </div>
  );
});

export default EnhancedComponent;
