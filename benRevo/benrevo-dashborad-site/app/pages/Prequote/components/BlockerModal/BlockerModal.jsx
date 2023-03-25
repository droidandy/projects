import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'semantic-ui-react';
import { Link } from 'react-router';

class BlockerModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    open: PropTypes.bool.isRequired,
    link: PropTypes.string.isRequired,
  };

  render() {
    const {
      title,
      description,
      open,
      link,
    } = this.props;
    return (
      <Modal open={open} className="blocker-modal" size="small">
        <Button as={Link} to={link} className="close-btn">X</Button>
        <Modal.Header className="blocker-modal-header">{title}</Modal.Header>
        <Modal.Content>
          <div className="image-holder" />
          <Modal.Description className="blocker-modal-description">
            <p>{description}</p>
          </Modal.Description>
          <Button as={Link} to={link} size="medium" className="blocker-modal-button">OK</Button>
        </Modal.Content>
      </Modal>
    );
  }
}

export default BlockerModal;
