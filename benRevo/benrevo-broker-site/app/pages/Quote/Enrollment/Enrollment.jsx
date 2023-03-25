import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import { Enrollment } from '@benrevo/benrevo-react-quote';

class EnrollmentModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  render() {
    const { openModal, closeModal } = this.props;
    return (
      <Modal
        open={openModal}
        size="large"
        className="presentation-modal presentation-modal-enrollment"
        onClose={() => { closeModal('enrollment'); }}
        closeIcon={<span className="close" />}
      >
        <Modal.Content>
          <Header as="h1" className="page-heading">Enrollment</Header>
          <div className="content-inner presentationMainContainer">
            <Enrollment hideTitle />
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default EnrollmentModal;
