import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Button, Dimmer, Loader } from 'semantic-ui-react';
import { LifeStdLtdRates } from '@benrevo/benrevo-react-rfp';

class EditRenewalAncillaryModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    requestError: PropTypes.bool.isRequired,
    section: PropTypes.string.isRequired,
    simpleSection: PropTypes.string.isRequired,
    optionId: PropTypes.number.isRequired,
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    getCurrentAncillaryOption: PropTypes.func.isRequired,
    saveCurrentAncillaryOption: PropTypes.func.isRequired,
    changeLoad: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const {
      section,
      getCurrentAncillaryOption,
      simpleSection,
      optionId,
    } = this.props;
    getCurrentAncillaryOption(section, simpleSection, true, optionId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading && this.props.loading && !nextProps.requestError) {
      this.props.changeLoad(nextProps.section, { options: true });
      this.props.closeModal('editRenewal');
    }
  }

  changePage(direction) {
    const { section, simpleSection, optionId } = this.props;
    const ancillaryType = section.indexOf('vol_') >= 0 ? 'voluntaryPlan' : 'basicPlan';
    if (direction === 'next') {
      this.props.saveCurrentAncillaryOption(this.props.section, true, ancillaryType, simpleSection, optionId);
    }
  }

  render() {
    const {
      openModal,
      closeModal,
      loading,
      section,
      simpleSection,
    } = this.props;
    const ancillaryType = section.indexOf('vol_') >= 0 ? 'voluntaryPlan' : 'basicPlan';

    return (
      <Modal
        open={openModal}
        size="large"
        className="presentation-modal presentation-modal-edit-current"
        onClose={() => { closeModal('editRenewal'); }}
        closeIcon={<span className="close" />}
      >
        <Modal.Content>
          <div className="content-inner medicalRfpMainContainer">
            <Header as="h1" className="page-heading">Rates</Header>
            <LifeStdLtdRates
              {...this.props}
              section={simpleSection}
              hideButtons
              hideTitle
              withoutRenewal
              showRenewalTitle
              showBasic={ancillaryType === 'basicPlan'}
              showVoluntary={ancillaryType === 'voluntaryPlan'}
              hideVoluntary={ancillaryType === 'basicPlan'}
              hideBasic={ancillaryType === 'voluntaryPlan'}
            />
            <div className="pageFooterActions">
              <Button onClick={() => { this.changePage('next'); }} primary floated="right" size="big">Save & Continue</Button>
            </div>
            <Dimmer active={loading} inverted>
              <Loader indeterminate size="big">Saving...</Loader>
            </Dimmer>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default EditRenewalAncillaryModal;
