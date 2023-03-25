import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Tab, Button, Dimmer, Loader } from 'semantic-ui-react';
import Rates from './components/Rates';
import Benefits from './components/Benefits';

class EditCurrentModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    requestError: PropTypes.bool.isRequired,
    section: PropTypes.string.isRequired,
    optionId: PropTypes.number.isRequired,
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    getCurrentOption: PropTypes.func.isRequired,
    saveCurrentOption: PropTypes.func.isRequired,
    changeLoad: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentTab: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
    this.saveOption = this.saveOption.bind(this);
  }

  componentWillMount() {
    const { section, getCurrentOption, optionId } = this.props;
    getCurrentOption(section, optionId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.loading !== this.props.loading && this.props.loading && (this.state.currentTab === 1) && !nextProps.requestError) {
      this.props.changeLoad(nextProps.section, { options: true });
      this.props.closeModal('editRenewal');
    } else if (nextProps.loading !== this.props.loading && this.props.loading && this.state.currentTab !== 1 && !nextProps.requestError) {
      this.changePage('next');
    }
  }

  changePage(direction) {
    if (direction === 'next') {
      if (this.state.currentTab < 1) this.setState({ currentTab: this.state.currentTab += 1 });
    } else {
      this.setState({ currentTab: this.state.currentTab -= 1 });
    }
  }

  handleTabChange(e, { activeIndex }) {
    this.setState({ currentTab: activeIndex });
  }

  saveOption() {
    const {
      section,
      saveCurrentOption,
      optionId,
    } = this.props;

    saveCurrentOption(section, optionId, true);
  }

  render() {
    const {
      section,
      openModal,
      closeModal,
      loading
    } = this.props;
    const { currentTab } = this.state;
    const panes = [
      { menuItem: '1. Rates', render: () => <Rates section={section} /> },
      { menuItem: '2. Benefits', render: () => <Benefits section={section} /> },
    ];
    return (
      <Modal
        open={openModal}
        size="large"
        className="presentation-modal presentation-modal-edit-current"
        onClose={() => { closeModal('editRenewal'); }}
        closeIcon={<span className="close" />}
      >
        <Modal.Content>
          <div className="content-inner">
            <Tab onTabChange={this.handleTabChange} activeIndex={currentTab} className="presentation-tab-top-menu medicalRfpMainContainer" panes={panes} />
            <div className="pageFooterActions">
              { <Button onClick={this.saveOption} primary floated="right" size="big">Save & Continue</Button> }
              { currentTab !== 0 && <Button onClick={() => { this.changePage('back'); }} floated="left" size="big" basic>Back</Button> }
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

export default EditCurrentModal;
