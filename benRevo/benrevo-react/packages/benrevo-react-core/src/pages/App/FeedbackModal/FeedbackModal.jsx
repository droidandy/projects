import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, TextArea, Dropdown, Form } from 'semantic-ui-react';
import { FEEDBACK_BUG, FEEDBACK_REQUEST, FEEDBACK_COMMENT, FEEDBACK_OTHER } from '../constants';

const feedbackOptions = [
  { key: 'b', value: 'bug', text: FEEDBACK_BUG },
  { key: 'f', value: 'feature_request', text: FEEDBACK_REQUEST },
  { key: 'p', value: 'positive', text: FEEDBACK_COMMENT },
  { key: 'i', value: 'other', text: FEEDBACK_OTHER },
];

class FeedbackModal extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    sendFeedback: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: '',
      feedbackType: 'bug',
    };
    this.setFeedbackType = this.setFeedbackType.bind(this);
  }

  setFeedbackType(value) {
    this.setState({ feedbackType: value });
  }

  render() {
    const { open, closeModal, sendFeedback } = this.props;
    const metadata = {
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
      userAgent: navigator.userAgent,
    };
    return (
      <Modal
        className="feedback-modal"
        open={open}
        onClose={closeModal}
        closeOnDimmerClick={false}
        closeIcon={<span className="close">X</span>}
        size="tiny"
      >
        <Modal.Content>
          <Modal.Description>
            <div className="feedback-header">
              <div className="feedback-image"></div>
              Send us your feedback
            </div>
            <div className="feedback-section">
              <p>We look forward to hearing what you have to say. Our success is built on your feedback, positive or negative.</p>
              <Dropdown selection fluid defaultValue={'bug'} options={feedbackOptions} onChange={(e, inputState) => { this.setFeedbackType(inputState.value); }}></Dropdown>
            </div>
            <div className="feedback-section">
              <p>Comments:</p>
              <Form>
                <TextArea autoHeight rows="5" placeholder="Describe your feedback" onChange={(e) => this.setState({ data: e.target.value })} />
              </Form>
            </div>
            <div className="buttons feedback-section">
              <a tabIndex="0" className="cancel-button" onClick={() => { closeModal(); }}>Cancel</a>
              <Button disabled={!this.state.data} className="not-link-button" size="medium" primary onClick={() => { sendFeedback(window.location.href, this.state.data, this.state.feedbackType, metadata); closeModal(); }}>Send</Button>
            </div>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export default FeedbackModal;
