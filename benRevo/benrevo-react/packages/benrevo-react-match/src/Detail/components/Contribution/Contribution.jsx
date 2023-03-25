import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header } from 'semantic-ui-react';
import ContributionTable from './ContributionTable';

class ContributionModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  render() {
    const { openModal, closeModal, section } = this.props;
    return (
      <Modal
        open={openModal}
        size="large"
        className="presentation-modal presentation-modal-contribution"
        onClose={() => { closeModal('contribution'); }}
        closeIcon={<span className="close" />}
      >
        <Modal.Content>
          <Header as="h1" className="page-heading">Contribution</Header>
          <div className="content-inner presentationMainContainer">
            <ContributionTable section={section} />
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ContributionModal;
